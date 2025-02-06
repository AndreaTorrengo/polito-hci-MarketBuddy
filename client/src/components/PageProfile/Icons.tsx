const BASE_PATH = '/src/assets/profile_pictures';

export const DEFAULT_ICON_PATH = `${BASE_PATH}/default-user.png`;
export const LOCKED_ICON_PATH = `${BASE_PATH}/locked-icon.png`;

export class Icon {
    id: number;
    path: string;

    constructor(id: number, path: string = DEFAULT_ICON_PATH) {
        this.id = id;
        this.path = path;
    }
}

export class IconLocker {
    lockingStatus: {id: number, locked: boolean}[];

    constructor() {
        this.lockingStatus = ICONS.map(i => ({id: i.id, locked: true}));
        this.lockingStatus[0].locked = false;
    }
    save() {
        localStorage.setItem('iconLocker', JSON.stringify(this.lockingStatus));
    }
    load() {
        const data = localStorage.getItem('iconLocker');
        if (data) {
            this.lockingStatus = JSON.parse(data);
        }
    }
    getItemIndex(id: number) {
        return this.lockingStatus.findIndex(i => i.id === id);
    }
    unlock(id: number) {
        const index = this.getItemIndex(id);
        if (index === -1) {
            console.warn(`Icon with id ${id} not found in lockingStatus`);
            return;
        }
        this.lockingStatus[index].locked = false;
        this.save();
    }
}


export const ICONS = [
    new Icon(1, DEFAULT_ICON_PATH ),
    new Icon(2, `${BASE_PATH}/planet03.png` ),
    new Icon(3, `${BASE_PATH}/mars.png` ),
    new Icon(4, `${BASE_PATH}/jupiter.png` ),
    new Icon(5, `${BASE_PATH}/saturn.png` ),
    new Icon(6, `${BASE_PATH}/neptune.png` ),
    new Icon(7, `${BASE_PATH}/moon.png` ),
    new Icon(8, `${BASE_PATH}/sun-glasses.png` ),
];
