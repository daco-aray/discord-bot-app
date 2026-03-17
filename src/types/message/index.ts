export default interface Message {
    content: string;
    channel: string;
    author: {
        bot: boolean;
        username: string;
    };
    mentions: {
        users: any;
        channels: any;
        everyone: boolean;
        
    };
    guild: {
        id: string;
    };
    reply: (response: string) => void;
}
