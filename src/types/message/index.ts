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
    reply: (response: string) => void;
}
