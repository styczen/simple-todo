I have written some simple REST APIs for TODO apps but it was all I did.
This one I want to use as my daily TODO app, because I want
"My Day" tab to automatically (or when some switch is clicked)
fill with tasks from "All tasks" tab when I refresh.
At first I will try to run server locally on Raspberry Pi 3b
and sync with storage when I am connected to my local network.

**DISCLAIMER 1**: I have no idea how to make good UI at all, so there might and will
be some very stupid things done there

**DISCLAIMER 2**: I know that there are a lot of ready
components e.g. in react-native-elements but I want to do something on my own
(at least this time)

## Setup
1. Install Docker (e.g. Ubuntu: https://docs.docker.com/engine/install/ubuntu/)
2. Install Docker Compose https://docs.docker.com/compose/install/.

**NOTE:** If you want to install Docker Compose (at least **version 1**) on Raspberry Pi,
instruction above might not work while installing it. 
Follow steps below (for Docker Compose, everything should be fine with Docker alone):
- install dependencies: *sudo apt-get install -y libffi-dev libssl-dev python3-dev python3 python3-pip*,
- install compose: *sudo pip3 install docker-compose*

### Backend TODOs

- [ ] write some tests for backend,
- [ ] a lot of refactoring...

### Frontend TODOs

- [ ] create simplest/usable UI possible (almost done),
- [ ] store current data locally when not connected to server,
- [ ] refactor code (separate code for fetching),
- [ ] option to set specific time when task should be done,
- [ ] push notifications when task has reminder set,
- [ ] when simple UI is done and other stuff is finished, make UI better (maybe
      use some designing tool first like Figma, to lay everything out),

