export default interface Message {
    content: string;
    author: {
        bot: boolean;
        username: string;
    };
    reply: (response: string) => void;
}