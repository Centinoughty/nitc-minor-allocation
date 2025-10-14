#!/bin/bash

tmux new-session -d -s minor

tmux rename-window -t minor:0 'server'
tmux send-keys -t minor:0 "cd $PWD/server && node index.js" C-m

tmux new-window -t minor:1 -n 'client'
tmux send-keys -t minor:1 "cd $PWD/client && npm start" C-m

tmux new-window -t minor:2 -n 'admin'
tmux send-keys -t minor:2 "cd $PWD/admin && serve -s dist -p 3002" C-m

tmux attach -t minor
