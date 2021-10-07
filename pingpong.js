import {createClient} from "@liveblocks/client";
import {key} from "./key";

class PingPong {
    setup() {
        this.client = createClient({publicApiKey: key});
        this.room = this.client.enter("my-room");

        this.room.subscribe("event", (event) => this.handleEvent(event));
        this.room.subscribe("my-presence", (presence) => this.myPresenceEvent(presence));
        this.room.subscribe("others", (presence) => this.presenceEvent(presence));

        this.room.updatePresence({name: this.randomString()});

        this.self = this.room.getPresence();

        this.pinged = false;
    }

    ping() {
        if (this.room) {
            console.log("sending ping");
            this.pinged = true;
            this.room.broadcastEvent({type: "ping", id: this.self.name, time: new Date().toISOString()});
        }
    }

    pong() {
        if (this.room) {
            console.log("sending pong");
            setTimeout(() => {
                this.room.broadcastEvent({type: "pong", id: this.self.name, time: new Date().toISOString()});
            }, 1000);
        }
    }

    handleEvent(event) {
        let {type, id, time} = event.event
        if (!this.leader && type === "ping") {
            this.pong();
        } else if (this.leader && type === "pong") {
            this.ping();
        }
        console.log(id, type, time);
    }

    myPresenceEvent(presence) {
        console.log("my-presence", presence);
    }
    
    presenceEvent(presence) {
        let pinged = this.pinged;
        if (presence.count === 0) {
            this.leader = presence.count === 0;
        }
        console.log("isLeader", this.leader);
        if (!pinged && this.leader && presence.count > 0) {
            this.ping();
        }
    }

    randomString() {
        return Math.floor(Math.random() * 36 ** 10).toString(36);
    }
}
    
function start() {
    let pingpong = new PingPong();
    pingpong.setup();
}
    
window.onload = start;
