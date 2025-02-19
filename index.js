const FILE_PATH = process.env.FILE_PATH || './temp'; // 运行文件夹，节点文件存放目录
const projectPageURL = process.env.URL || '';        // 填写项目域名可开启自动访问保活，非标端口的前缀是http://
const intervalInseconds = process.env.TIME || 120;   // 自动访问间隔时间（120秒）
const UUID = process.env.UUID || '89c13786-25aa-4520-b2e7-12cd60fb5202';
const NEZHA_SERVER = process.env.NEZHA_SERVER || 'nezha.hani.nyc.mn';     // 哪吒3个变量不全不运行
const NEZHA_PORT = process.env.NEZHA_PORT || '443';              // 哪吒端口为{443,8443,2096,2087,2083,2053}其中之一时开启tls
const NEZHA_KEY = process.env.NEZHA_KEY || 'eah0fqzGzQjx2BjJez';                    // 哪吒客户端密钥
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || '';                // 固定隧道域名，留空即启用临时隧道
const ARGO_AUTH = process.env.ARGO_AUTH || '';                    // 固定隧道json或token，留空即启用临时隧道
const CFIP = process.env.CFIP || 'www.visa.com.tw';               // 优选域名或优选ip
const CFPORT = process.env.CFPORT || 443;                         // 节点端口
const NAME = process.env.NAME || 'Vls';                           // 节点名称
const ARGO_PORT = process.env.ARGO_PORT || 8001;                  // Argo端口，使用固定隧道token需和cf后台设置的端口对应
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000; // 节点订阅端口，若无法订阅请手动改为分配的端口

const express = require('express'),
  app = express(),
  axios = require('axios'),
  os = require('os'),
  fs = require('fs'),
  path = require('path'),
  {
    promisify
  } = require('util'),
  exec = promisify(require('child_process')['exec']),
  {
    execSync
  } = require('child_process');
!fs['existsSync'](FILE_PATH) ? (fs['mkdirSync'](FILE_PATH), console['log'](FILE_PATH + ' is created')) : console['log'](FILE_PATH + ' already exists');
const pathsToDelete = ['web', 'bot', 'npm', 'sub.txt', 'boot.log'];
function cleanupOldFiles() {
  pathsToDelete['forEach'](_0x23f7be => {
    const _0x647eeb = path['join'](FILE_PATH, _0x23f7be);
    fs['unlink'](_0x647eeb, _0x41caf4 => {
      _0x41caf4 ? console['error']('Skip Delete ' + _0x647eeb) : console['log'](_0x647eeb + ' deleted');
    });
  });
}
cleanupOldFiles(), app['get']('/', function (_0x6ca981, _0x185a31) {
  _0x185a31['send']('Hello world!');
});
const config = {
  'log': {
    'access': '/dev/null',
    'error': '/dev/null',
    'loglevel': 'none'
  },
  'inbounds': [{
    'port': ARGO_PORT,
    'protocol': 'vless',
    'settings': {
      'clients': [{
        'id': UUID,
        'flow': 'xtls-rprx-vision'
      }],
      'decryption': 'none',
      'fallbacks': [{
        'dest': 0xbb9
      }, {
        'path': '/vless-argo',
        'dest': 0xbba
      }, {
        'path': '/vmess-argo',
        'dest': 0xbbb
      }, {
        'path': '/trojan-argo',
        'dest': 0xbbc
      }]
    },
    'streamSettings': {
      'network': 'tcp'
    }
  }, {
    'port': 0xbb9,
    'listen': '127.0.0.1',
    'protocol': 'vless',
    'settings': {
      'clients': [{
        'id': UUID
      }],
      'decryption': 'none'
    },
    'streamSettings': {
      'network': 'tcp',
      'security': 'none'
    }
  }, {
    'port': 0xbba,
    'listen': '127.0.0.1',
    'protocol': 'vless',
    'settings': {
      'clients': [{
        'id': UUID,
        'level': 0x0
      }],
      'decryption': 'none'
    },
    'streamSettings': {
      'network': 'ws',
      'security': 'none',
      'wsSettings': {
        'path': '/vless-argo'
      }
    },
    'sniffing': {
      'enabled': false,
      'destOverride': ['http', 'tls', 'quic'],
      'metadataOnly': false
    }
  }, {
    'port': 0xbbb,
    'listen': '127.0.0.1',
    'protocol': 'vmess',
    'settings': {
      'clients': [{
        'id': UUID,
        'alterId': 0x0
      }]
    },
    'streamSettings': {
      'network': 'ws',
      'wsSettings': {
        'path': '/vmess-argo'
      }
    },
    'sniffing': {
      'enabled': false,
      'destOverride': ['http', 'tls', 'quic'],
      'metadataOnly': false
    }
  }, {
    'port': 0xbbc,
    'listen': '127.0.0.1',
    'protocol': 'trojan',
    'settings': {
      'clients': [{
        'password': UUID
      }]
    },
    'streamSettings': {
      'network': 'ws',
      'security': 'none',
      'wsSettings': {
        'path': '/trojan-argo'
      }
    },
    'sniffing': {
      'enabled': false,
      'destOverride': ['http', 'tls', 'quic'],
      'metadataOnly': false
    }
  }],
  'dns': {
    'servers': ['https+local://8.8.8.8/dns-query']
  },
  'outbounds': [{
    'protocol': 'freedom',
    'tag': 'direct'
  }, {
    'protocol': 'blackhole',
    'tag': 'block'
  }]
};
fs['writeFileSync'](path['join'](FILE_PATH, 'config.json'), JSON['stringify'](config, null, 0x2));
function getSystemArchitecture() {
  const _0x39b31f = os['arch']();
  return _0x39b31f === 'arm' || _0x39b31f === 'arm64' || _0x39b31f === 'aarch64' ? 'arm' : 'amd';
}
function downloadFile(_0x5e911a, _0xc87047, _0x46b345) {
  const _0x24b3ee = path['join'](FILE_PATH, _0x5e911a),
    _0x4a25fd = fs['createWriteStream'](_0x24b3ee);
  axios({
    'method': 'get',
    'url': _0xc87047,
    'responseType': 'stream'
  })['then'](_0x3aecb9 => {
    _0x3aecb9['data'].pipe(_0x4a25fd), _0x4a25fd['on']('finish', () => {
      _0x4a25fd['close'](), console['log']('Download ' + _0x5e911a + ' successfully'), _0x46b345(null, _0x5e911a);
    }), _0x4a25fd['on']('error', _0x5e3f83 => {
      fs['unlink'](_0x24b3ee, () => {});
      const _0x1d9ca9 = 'Download ' + _0x5e911a + ' failed: ' + _0x5e3f83['message'];
      console['error'](_0x1d9ca9), _0x46b345(_0x1d9ca9);
    });
  })['catch'](_0x6dec02 => {
    const _0x3b48ce = 'Download ' + _0x5e911a + ' failed: ' + _0x6dec02['message'];
    console['error'](_0x3b48ce), _0x46b345(_0x3b48ce);
  });
}
async function downloadFilesAndRun() {
  const _0x1e3bf1 = getSystemArchitecture(),
    _0x3f5fae = getFilesForArchitecture(_0x1e3bf1);
  if (_0x3f5fae['length'] === 0x0) {
    console['log']('Can\'t find a file for the current architecture');
    return;
  }
  const _0x1f8c6c = _0x3f5fae['map'](_0x5b25e0 => {
    return new Promise((_0x13ddd3, _0x4dd495) => {
      downloadFile(_0x5b25e0['fileName'], _0x5b25e0['fileUrl'], (_0x366abd, _0x13081e) => {
        _0x366abd ? _0x4dd495(_0x366abd) : _0x13ddd3(_0x13081e);
      });
    });
  });
  try {
    await Promise['all'](_0x1f8c6c);
  } catch (_0x235c08) {
    console['error']('Error downloading files:', _0x235c08);
    return;
  }
  function _0x319884(_0x4dfea4) {
    const _0x203358 = 0x1fd;
    _0x4dfea4['forEach'](_0x58dd32 => {
      const _0x124a55 = path['join'](FILE_PATH, _0x58dd32);
      fs['chmod'](_0x124a55, _0x203358, _0x60c289 => {
        _0x60c289 ? console['error']('Empowerment failed for ' + _0x124a55 + ': ' + _0x60c289) : console['log']('Empowerment success for ' + _0x124a55 + ': ' + _0x203358['toString'](0x8));
      });
    });
  }
  const _0x166b78 = ['./npm', './web', './bot'];
  _0x319884(_0x166b78);
  let _0xf5c50e = '';
  if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
    const _0x2fedc0 = ['443', '8443', '2096', '2087', '2083', '2053'];
    _0x2fedc0['includes'](NEZHA_PORT) ? _0xf5c50e = '--tls' : _0xf5c50e = '';
    const _0x199467 = 'nohup ' + FILE_PATH + '/npm -s ' + NEZHA_SERVER + ':' + NEZHA_PORT + ' -p ' + NEZHA_KEY + ' ' + _0xf5c50e + ' >/dev/null 2>&1 &';
    try {
      await exec(_0x199467), console['log']('npm is running'), await new Promise(_0x2c594a => setTimeout(_0x2c594a, 0x3e8));
    } catch (_0x5c665a) {
      console['error']('npm running error: ' + _0x5c665a);
    }
  } else console['log']('NEZHA variable is empty,skip running');
  const _0x4b6202 = 'nohup ' + FILE_PATH + '/web -c ' + FILE_PATH + '/config.json >/dev/null 2>&1 &';
  try {
    await exec(_0x4b6202), console['log']('web is running'), await new Promise(_0x272c20 => setTimeout(_0x272c20, 0x3e8));
  } catch (_0x3fd99b) {
    console['error']('web running error: ' + _0x3fd99b);
  }
  if (fs['existsSync'](path['join'](FILE_PATH, 'bot'))) {
    let _0x32b5c2;
    if (ARGO_AUTH['match'](/^[A-Z0-9a-z=]{120,250}$/)) _0x32b5c2 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ' + ARGO_AUTH;else ARGO_AUTH['match'](/TunnelSecret/) ? _0x32b5c2 = 'tunnel --edge-ip-version auto --config ' + FILE_PATH + '/tunnel.yml run' : _0x32b5c2 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ARGO_PORT;
    try {
      await exec('nohup ' + FILE_PATH + '/bot ' + _0x32b5c2 + ' >/dev/null 2>&1 &'), console['log']('bot is running'), await new Promise(_0x4640e0 => setTimeout(_0x4640e0, 0x7d0));
    } catch (_0x4ad681) {
      console['error']('Error executing command: ' + _0x4ad681);
    }
  }
  await new Promise(_0x2a30bb => setTimeout(_0x2a30bb, 0x1388));
}
function getFilesForArchitecture(_0x1383b3) {
  if (_0x1383b3 === 'arm') return [{
    'fileName': 'npm',
    'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/swith'
  }, {
    'fileName': 'web',
    'fileUrl': 'https://github.com/eooce/test/releases/download/ARM/web'
  }, {
    'fileName': 'bot',
    'fileUrl': 'https://github.com/eooce/test/releases/download/arm64/bot13'
  }];else {
    if (_0x1383b3 === 'amd') return [{
      'fileName': 'npm',
      'fileUrl': 'https://github.com/eooce/test/raw/main/amd64'
    }, {
      'fileName': 'web',
      'fileUrl': 'https://github.com/eooce/test/raw/main/web'
    }, {
      'fileName': 'bot',
      'fileUrl': 'https://github.com/eooce/test/raw/main/server'
    }];
  }
  return [];
}
function argoType() {
  if (!ARGO_AUTH || !ARGO_DOMAIN) {
    console['log']('ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels');
    return;
  }
  if (ARGO_AUTH['includes']('TunnelSecret')) {
    fs['writeFileSync'](path['join'](FILE_PATH, 'tunnel.json'), ARGO_AUTH);
    const _0x5b8696 = '\n  tunnel: ' + ARGO_AUTH['split']('"')[0xb] + '\n  credentials-file: ' + path['join'](FILE_PATH, 'tunnel.json') + '\n  protocol: http2\n  \n  ingress:\n    - hostname: ' + ARGO_DOMAIN + '\n      service: http://localhost:' + ARGO_PORT + '\n      originRequest:\n        noTLSVerify: true\n    - service: http_status:404\n  ';
    fs['writeFileSync'](path['join'](FILE_PATH, 'tunnel.yml'), _0x5b8696);
  } else console['log']('ARGO_AUTH mismatch TunnelSecret,use token connect to tunnel');
}
argoType();
async function extractDomains() {
  let _0x502853;
  if (ARGO_AUTH && ARGO_DOMAIN) _0x502853 = ARGO_DOMAIN, console['log']('ARGO_DOMAIN:', _0x502853), await _0x64980a(_0x502853);else try {
    const _0xd83813 = fs['readFileSync'](path['join'](FILE_PATH, 'boot.log'), 'utf-8'),
      _0x331611 = _0xd83813['split']('\n'),
      _0x4a054c = [];
    _0x331611['forEach'](_0x42a583 => {
      const _0x290248 = _0x42a583['match'](/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
      if (_0x290248) {
        const _0x363397 = _0x290248[0x1];
        _0x4a054c['push'](_0x363397);
      }
    });
    if (_0x4a054c['length'] > 0x0) _0x502853 = _0x4a054c[0x0], console['log']('ArgoDomain:', _0x502853), await _0x64980a(_0x502853);else {
      console['log']('ArgoDomain not found, re-running bot to obtain ArgoDomain'), fs['unlinkSync'](path['join'](FILE_PATH, 'boot.log')), await new Promise(_0x3ff9ea => setTimeout(_0x3ff9ea, 0x7d0));
      const _0x5d2160 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ' + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ARGO_PORT;
      try {
        await exec('nohup ' + path['join'](FILE_PATH, 'bot') + ' ' + _0x5d2160 + ' >/dev/null 2>&1 &'), console['log']('bot is running.'), await new Promise(_0x364fc6 => setTimeout(_0x364fc6, 0xbb8)), await extractDomains();
      } catch (_0x1f3083) {
        console['error']('Error executing command: ' + _0x1f3083);
      }
    }
  } catch (_0x2cb3ac) {
    console['error']('Error reading boot.log:', _0x2cb3ac);
  }
  async function _0x64980a(_0x480312) {
    const _0x56db99 = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', {
        'encoding': 'utf-8'
      }),
      _0x6f3d38 = _0x56db99['trim']();
    return new Promise(_0x2b742a => {
      setTimeout(() => {
        const _0x399811 = {
            'v': '2',
            'ps': NAME + '-' + _0x6f3d38,
            'add': CFIP,
            'port': CFPORT,
            'id': UUID,
            'aid': '0',
            'scy': 'none',
            'net': 'ws',
            'type': 'none',
            'host': _0x480312,
            'path': '/vmess-argo?ed=2048',
            'tls': 'tls',
            'sni': _0x480312,
            'alpn': ''
          },
          _0x17ff11 = '\nvless://' + UUID + '@' + CFIP + ':' + CFPORT + '?encryption=none&security=tls&sni=' + _0x480312 + '&type=ws&host=' + _0x480312 + '&path=%2Fvless-argo%3Fed%3D2048#' + NAME + '-' + _0x6f3d38 + '\n  \nvmess://' + Buffer['from'](JSON['stringify'](_0x399811))['toString']('base64') + '\n  \ntrojan://' + UUID + '@' + CFIP + ':' + CFPORT + '?security=tls&sni=' + _0x480312 + '&type=ws&host=' + _0x480312 + '&path=%2Ftrojan-argo%3Fed%3D2048#' + NAME + '-' + _0x6f3d38 + '\n    ';
        console['log'](Buffer['from'](_0x17ff11)['toString']('base64'));
        const _0x1f4aba = path['join'](FILE_PATH, 'sub.txt');
        fs['writeFileSync'](_0x1f4aba, Buffer['from'](_0x17ff11)['toString']('base64')), console['log'](FILE_PATH + '/sub.txt saved successfully'), app['get']('/sub', (_0x443afd, _0x45e424) => {
          const _0x3ef68a = Buffer['from'](_0x17ff11)['toString']('base64');
          _0x45e424['set']('Content-Type', 'text/plain; charset=utf-8'), _0x45e424['send'](_0x3ef68a);
        }), _0x2b742a(_0x17ff11);
      }, 0x7d0);
    });
  }
}
const npmPath = path['join'](FILE_PATH, 'npm'),
  webPath = path['join'](FILE_PATH, 'web'),
  botPath = path['join'](FILE_PATH, 'bot'),
  bootLogPath = path['join'](FILE_PATH, 'boot.log'),
  configPath = path['join'](FILE_PATH, 'config.json');
function cleanFiles() {
  setTimeout(() => {
    exec('rm -rf ' + bootLogPath + ' ' + configPath + ' ' + npmPath + ' ' + webPath + ' ' + botPath, (_0x47b474, _0x3959e5, _0x1f6186) => {
      if (_0x47b474) {
        console['error']('Error while deleting files: ' + _0x47b474);
        return;
      }
      console['clear'](), console['log']('App is running'), console['log']('Thank you for using this script, enjoy!');
    });
  }, 0xea60);
}
cleanFiles();
let hasLoggedEmptyMessage = false;
async function visitProjectPage() {
  try {
    if (!projectPageURL || !intervalInseconds) {
      !hasLoggedEmptyMessage && (console['log']('URL or TIME variable is empty,skip visit url'), hasLoggedEmptyMessage = true);
      return;
    } else hasLoggedEmptyMessage = false;
    await axios['get'](projectPageURL), console['log']('Page visited successfully'), console['clear']();
  } catch (_0x2c3e83) {
    console['error']('Error visiting project page:', _0x2c3e83['message']);
  }
}
setInterval(visitProjectPage, intervalInseconds * 0x3e8);
async function startserver() {
  await downloadFilesAndRun(), await extractDomains(), visitProjectPage();
}
startserver(), app['listen'](PORT, () => console['log']('Http server is running on port:' + PORT + '!'));
