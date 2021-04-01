async function run(kibanaHome, env, username, passwordParam) {
  if (!kibanaHome || !env || !username) {
    console.log('USAGE: node index.js <kibanaHome> <environment> <username> (<password>)');
    return;
  }

  let password = passwordParam;
  if (!password) {
    const prompt = require('password-prompt');
    password = await prompt('password: ', { method: 'hide' });
  }

  const { PlatformClient } = require('microservice-utilities');
  const fs = require('fs-extra');
  const path = require('path');
  const { execFileSync } = require('child_process');

  const authResponse = await new PlatformClient(() => {}).post('https://oauth.provider.io/oauth/token', {
    // grant_type: 'http://password-realm',
    // audience: '',
    // client_id: '',
    // realm: '',
    username: username,
    password: password
  });
  const token = authResponse.data.access_token;

  // TODO: Replace this with the actual location of the ES proxy
  const configFileContent = `elasticsearch.url: "https://es.proxy.amazon.com.io:443/${env}"
elasticsearch.requestHeadersWhitelist: [ authorization ]
elasticsearch.customHeaders: {authorization: 'Bearer ${token}'}
`;

  const kibanaHomeFullPath = path.resolve(kibanaHome);
  const configFileLocation = path.join(kibanaHomeFullPath, 'config', 'kibana.yml');
  const configFileBackupPath = path.resolve(configFileLocation, '.backup');
  if (!fs.pathExists(configFileBackupPath)) {
    console.log('creating a backup of the original config file');
    await fs.copy(configFileLocation, configFileBackupPath);
  }

  await fs.writeFile(configFileLocation, configFileContent);

  if (env === 'prod') {
    console.log('********************************************');
    console.log('******    !!!  PRODUCTION  !!!        ******');
    console.log('********************************************');
  }

  console.log('Starting Kibana at http://localhost:5601');
  console.log('Hit Ctrl + C to exit');
  execFileSync('node', [path.join(kibanaHomeFullPath, 'src', 'cli', 'cli.js')], { cwd: kibanaHomeFullPath });
}

run(process.argv[2], process.argv[3], process.argv[4], process.argv[5])
  .then(() => console.log('done'))
  .catch(err => console.error(err));
