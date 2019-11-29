# Intermediate

```json
{
  "parts":[{
    "packages":{
      "apt":[
        "ntp",
        "curl",
        "software-properties-common",
        "apt-transport-https",
        "ca-certificates","theend"
      ]
    }
  },{
    "from": "root-development",
    "packages":{
      "apt":[
        "nodejs",
        "ntp",
        "curl",
        "jq",
        "less",
        "rsync",
        "htop",
        "tree",
        "zip",
        "unzip",
        "silversearcher-ag",
        "vim",
        "inotify-tools",
        "perl",
        "theend"
      ]
    },
    "special":{
      "nodejs":{
        "apt":{
          "add_key": "https://deb.nodesource.com/gpgkey/nodesource.gpg.key",
          "sources":{
            "nodesource":{
              "deb":"https://deb.nodesource.com/node_12.x xenial main",
              "deb_src":"https://deb.nodesource.com/node_12.x xenial main"
            }
          }
        }
      }
    }
  },{
    "from":"base-development",
    "packages":{
      "apt":[
        "golang-go",
        "theend"
      ],
      "npm":[
        "aws-sdk",
        "cli-shezargs",
        "theend"
      ]
    },
    "special":{
      "golang-go":{
        "apt":{
          "add_apt_repository":{
            "golang-go":"ppa:longsleep/golang-backports"
          }
        }
      }
    }
  }]
}

```
