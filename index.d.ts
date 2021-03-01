export interface UserProfile {
    id: string,
    name: string,
    avatar: string,
    /** iso alpha 2 code */
    country: string,
    language: string,
    apiVersion: number;
}

export interface ReceivedTextMessage {
    text: string,
    /** milliseconds */
    timestamp: number,
    token: string,
    trackingData: any,
    keyboard: any,
    requiredArguments: string[],
    minApiVersion: undefined;
}

type ConversationStarted = (userProfile: UserProfile,
                             isSubscribed: boolean,
                             context: any,
                             onFinish: any) => any;

export interface Bot {
    onConversationStarted: (fn: ConversationStarted)=> void;
    onTextMessage: (pattern: RegExp, callback: (message: ReceivedTextMessage, response: any) => any) => any;
    middleware: () => any;
    onError: (callback: (error: any) => any) => any;
    setWebhook: (webhook: string) => Promise<any>;
    onSubscribe: (callback: (response: Response) => void ) => void;
    sendMessage: (minUserProfile: { id: string }, messages: any[]) => Promise<any>;
    onUnsubscribe: (callback: (userId: string) => void) => void;
    on: (eventName: string, handler: any)=>void;
}

export interface Keyboard {
    Type: 'keyboard',
    /** hex color */
    BgColor: string;
    Buttons: KeyboardButton[];
    InputFieldState: 'hidden' | 'regular' | 'minimized',
}

export interface KeyboardButton {
    Columns?: number,
    Rows?: number,
    ActionType?: "reply" | "open-url" | "none",
    ActionBody: string,
    /** hex color */
    BgColor?: string;
    Text: string;
    TextVAlign?: string,
    TextHAlign?: string,
    TextSize?: 'regular'
    Silent?: boolean;
    OpenURLType?: string,
    InternalBrowser?: {
        ActionButton?: string;
        ActionPredefinedURL?: string;
        Mode?: string;
        CustomTitle?: string,
    }
}

export interface RichMedia {
    ButtonsGroupColumns: number,
    ButtonsGroupRows: number,
    BgColor: string,
    Buttons: RichMediaButton[]
}

export interface RichMediaButton {
    Columns?: number;
    Rows?: number;
    ActionType?: "reply" | "open-url" | "none";
    ActionBody?: string;
    Image?: string;
    OpenURLType?: string;
    Text?: string;
    TextSize?: string;
    TextVAlign?: string;
    TextHAlign?: string;
    BgColor?: string;
    InternalBrowser?: {
        ActionButton: string;
        ActionPredefinedURL?: string;
    }
    Silent?: boolean;
}

export interface Response {
    userProfile: UserProfile,
    send: (messages: any | any[]) => void;
}

export interface StickerMessage {
    new (stickerId: number): StickerMessage;
}

export interface KeyboardMessage {
    new (
        keyboard: Keyboard,
        optionalTrackingData?: string,
        timestamp?: string,
        token?: string,
        minApiVersion?: number,
    ): KeyboardMessage;
}

export interface RichMediaMessage {
    new (
        richMedia: RichMedia,
        optionalKeyboard?: Keyboard,
        optionalTrackingData?: string,
        timestamp?: string,
        token?: string,
        optionalAltText?: string,
        minApiVersion?: number,
    ): RichMediaMessage;
}

export interface TextMessage {
    new (
        message: string,
        keyboard?: Keyboard,
        optionalTrackingData?: string,
        timestamp?: string,
        token?: string,
        minApiVersion?: number,
    ): TextMessage;
}
