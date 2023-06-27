export enum toastState {
    Success = "Success",
    Error = "Error",
    Warning = "Warning",
    Info = "Info"
};

export enum audioType {
    radio = "radio",
    podcast = "podcast",
    shows = "shows",
};
  
export enum conditionType {
    '!=' = "!=",
    '<' = "<",
    '<=' = "<=",
    '==' = "==",
    '>' = ">",
    '>=' = ">=",
    'array-contains' = "array-contains",
    'array-contains-any' = "array-contains-any",
    'in' = "in",
    'not-in' = "not-in",
};

export interface whereCondition {
    property: string, 
    condition: "!=" | "<" | "<=" | "==" | ">" | ">=" | "array-contains" | "array-contains-any" | "in" | "not-in",
    value: string
};


export interface userInterface {
    updatedAt: number,
    createdAt: number,
    email: string,
    name: string,
    phoneNumber: string,
    profilePhotoURL: string,
    id: string,
    userID: string,
    lastInteraction: number
}
  
export interface appUpdate {
    currentAppVersion: {
        iOS: string,
        android: string
    },
    status: boolean;
    forceful: boolean;
    displayText: {
        title: string;
        message: string;
        btn: string;
    }
}

export  interface audiosInterface {
    id: string,
    arrayID?: number,
    type: string,
    src: string,
    audio: any,
    title: string,
    description: string,
    image: string,
    category: string,
    ref_id: string,
    playStat: string,
    comments: any,
    createdAt: string,
    updatedAt: string,
  
    // playing controls
    durationSummary: string,
    timingInterval: any, 
    seekAudioRangeValue: number,
    currentTime: any,
    duration: any,
    playbackRate: any,
    loadingState: boolean // true, 
    isPlaying: boolean // false,
}

export interface audioInterface {
    id: string,
    title: string,
    description: string,
    image: string,
    src: string,
    ref_id: string,
    type: string,
    playStat: number,
  
    lastInteraction: any,
    createdAt: any,
    updatedAt: any,
    lastVisible: any
}
  
export interface shoutOutInterface {
    sender_name: string,
    sender_image: string,
    sender_email: string,
    sender_id: string,

    recipient_name: string,
    recipient_email: string,
    message: string,

    createdAt: any,
    updatedAt: any,
}

export interface podcastInterface {
    id: string,
    title: string,
    description: string,
    image: string,
    category: string,
    creator_id: string,
    creator_name: string,
    episodes: number,
    viewStat: number,
    lastInteraction: any,
    createdAt: any,
    updatedAt: any,
    
    _id: string,
    lastVisible: any
}

export interface showInterface {
    id: string,
    title: string,
    image: string,
    creator_id: string,
    creator_name: string, // Tesa Radio
    episodes: number,
    viewStat: number,
    lastInteraction: number,
    createdAt: number, // 1685722772394
    updatedAt: number,

    _id: string,
    lastVisible: any
};
  
export interface BrowserView {
    display: boolean,
    url: string,
    pageTitle: string
}


export interface chatList {
  // s_no: number,
  question: string,
  response: any,
}