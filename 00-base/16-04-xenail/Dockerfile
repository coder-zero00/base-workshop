FROM ubuntu:xenial

# Install needed software
RUN apt-get update && apt-get install -y --no-install-recommends   \
      ntp                               \
      curl                              \
      software-properties-common        \
      apt-transport-https               \
      ca-certificates                   \
          &&                            \
    rm -rf /var/lib/apt/lists/*     &&  \
    apt-get clean

RUN curl -sSL 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key' | apt-key add -                                  && \
    echo 'deb https://deb.nodesource.com/node_12.x xenial main' > /etc/apt/sources.list.d/nodesource.list             && \
    echo 'deb-src https://deb.nodesource.com/node_12.x xenial main' >> /etc/apt/sources.list.d/nodesource.list           \
          &&                            \
    apt-get update && apt-get install -y --no-install-recommends   \
      nodejs                            \
      build-essential                   \
          &&                            \
    rm -rf /var/lib/apt/lists/*     &&  \
    apt-get clean

RUN npm install --global                \
      claudia                           \
      run-anywhere

RUN add-apt-repository -y               \
      ppa:longsleep/golang-backports    \
          &&                            \
    apt-get update && apt-get install -y --no-install-recommends   \
      golang-go                         \
          &&                            \
    rm -rf /var/lib/apt/lists/*     &&  \
    apt-get clean

RUN apt-get update && apt-get install -y  --no-install-recommends  \
      ntp                               \
      curl                              \
      jq                                \
      less                              \
      rsync                             \
      htop                              \
      tree                              \
      zip                               \
      unzip                             \
      silversearcher-ag                 \
      redis-server                      \
          &&                            \
    rm -rf /var/lib/apt/lists/*     &&  \
    apt-get clean

RUN npm install --global                \
      aws-sdk                           \
      cli-shezargs

RUN apt-get update && apt-get install -y  --no-install-recommends  \
      vim                               \
      inotify-tools                     \
      gcc                               \
      g++                               \
      make                              \
      dnsutils                          \
      socat                             \
      telnet                            \
      python                            \
      python-pip                        \
      python-virtualenv                 \
      autoconf                          \
      automake                          \
      autotools-dev                     \
      debhelper                         \
      dh-make                           \
      debmake                           \
      devscripts                        \
      fakeroot                          \
      file                              \
      gnupg                             \
      lintian                           \
      patch                             \
      patchutils                        \
      pbuilder                          \
      perl                              \
      python                            \
      quilt                             \
      xutils-dev                        \
      libperl-dev                       \
      certbot                           \
          &&                            \
    rm -rf /var/lib/apt/lists/*     &&  \
    apt-get clean

RUN pip install --upgrade awscli


# Host-data volumes:
# https://www.techrepublic.com/article/how-to-share-data-between-a-docker-container-and-host/

# mkdir -p ~/container-data
# docker run -d -P --name datacontainer -v ${HOME}/container-data:/data ubuntu

# docker attach ID



      # python-certbot-nginx              \



# TODO: Install user
#       and data like aws config files
# TODO: Install rsyslog nginx wireshark nmap etc
# TODO: Install start redis-server
# TODO: Install volume(s)
# Doesnt have ping, ifconfig






# TODO: See also https://www.camptocamp.com/en/actualite/flexible-docker-entrypoints-scripts/
# for a 'universal' entrypont mechanism
#
# https://rock-it.pl/how-to-write-excellent-dockerfiles/





# This was from a base image when I was k8s-ifying mario
#
# RUN   apt-get update && apt-get install -y curl software-properties-common
#
# # See: https://askubuntu.com/questions/490468/add-apt-repository-throws-python-error-unicodedecodeerror-ascii-codec-cant
# ENV   LC_ALL=C.UTF-8
#
# RUN   curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
#       curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
#       add-apt-repository -y ppa:rmescandon/yq && \
#       echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
#       apt-get update && \
#       apt-get install -y --no-install-recommends nodejs yarn jq yq inotify-tools \
#           vim tree \
#           gcc g++ make dnsutils socat telnet && \
#       apt-get clean && \
#       rm -rf /var/lib/apt/lists && \
#       which node && node -v && npm -v



#  TODO: See also:
#  https://medium.com/@patdhlk/how-to-install-go-1-9-1-on-ubuntu-16-04-ee64c073cd79   (GO)
#
#  LLVM C++17 on 16.04
#  https://askubuntu.com/questions/1113974/using-c17-with-clang-on-ubuntu-16-04
#
#  or:
#
#  apt-get install clang-format clang-tidy clang-tools clang clangd libc++-dev libc++1 libc++abi-dev libc++abi1 libclang-dev libclang1 liblldb-dev libllvm-ocaml-dev libomp-dev libomp5 lld lldb llvm-dev llvm-runtime llvm python-clang
#
#  wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add -
# Fingerprint: 6084 F3CF 814B 57C1 CF12 EFD5 15CF 4D18 AF4F 7421
#
#  deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial main
#  deb-src http://apt.llvm.org/xenial/ llvm-toolchain-xenial main
# 8
#  deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-8 main
#  deb-src http://apt.llvm.org/xenial/ llvm-toolchain-xenial-8 main
# 9
#  deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-9 main
#  deb-src http://apt.llvm.org/xenial/ llvm-toolchain-xenial-9 main
