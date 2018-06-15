﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace ProductionLineServerWEG
{
    class ChatServer : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine(e.Data);
            Console.WriteLine(ID+"");
            Sessions.Broadcast(e.Data);
        }
    }
}