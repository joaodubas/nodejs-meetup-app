# nodejs sample app

Aplicação para palestra de desenvolvimento nodejs com docker.

## Rodando a aplicação

É necessário ter o [docker][docker] [instalado][docker-install] e rodando em
sua máquina.

Para rodar a aplicação use:

```shell
$ make start
```

Isso iniciará três containers:

1. `meetup_db`
2. `hud_db`
3. `meetup_app`

O container `meetup_db` é baseado na imagem
[joaodubas/multilevel:latest][index-multilevel]. Por sua vez o container
`hud_db` é baseado na imagem [joaodubas/levelhud:latest][index-levelhud]. Por
fim o container `meetup_app` é baseado na imagem
[joaodubas/nodejs:latest][index-nodejs].

As aplicações estão disponíveis nas _url_s:

1. http://127.0.0.1:8001 para acesso ao `meetup_app`
2. http://127.0.0.1:8002 para acesso ao `hud_db`

## Parando a aplicação

Para encerrar as imagens é necessário rodar:

```shell
$ make stop-all
```

## LICENÇA


Copyright (c) 2014 Joao Paulo Dubas <joao.dubas@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[docker]: http://www.docker.io
[docker-install]: http://docs.docker.io/en/latest/installation/
[index-multilevel]: https://index.docker.io/u/joaodubas/multilevel
[index-levelhud]: https://index.docker.io/u/joaodubas/levelhud
[index-nodejs]: https://index.docker.io/u/joaodubas/nodejs
