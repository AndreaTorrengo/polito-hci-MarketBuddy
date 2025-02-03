/* This module provide a class model for UserData and 
 * a few function for reading and writing on localstorage
 */
import { ICONS } from "./Icons";

export class UserData {
    username: string;
    coins: number;
    experience: number;
    iconId: number;

    constructor(username: string = 'user', coins: number = 1000, experience: number = 1200, iconId: number = 1) {
        this.username = username;
        this.coins = coins;
        this.experience = experience;
        this.iconId = iconId;
    }
    // Use this function to get a clone of this instance and use it to update the react state
    clone(): UserData {
        let clone = new UserData();
        Object.assign(clone, this);
        return clone;
    }
    // Use this function to increment or decrement coins
    incrCoins(increment: number): void {
        if (increment < 0 && increment > this.coins)
            this.coins = 0;
        else this.coins += increment;
    }
    // Use this function to increment or decrement experience
    incrExperience(increment: number): void {
        if (increment < 0 && increment > this.experience)
            this.experience = 0;
        else this.experience += increment;
    }
    // Use this function to get the icon path from the iconId
    /*getIconPath(): string {
        let iconObj = ICONS.filter(i => i.id == this.iconId)[0];
        if(!iconObj) {
            console.warn(`Could not find any profile icon with id ${this.iconId}`);
            iconObj = ICONS[0];
        }
        return iconObj.path;
    }*/
    public static getIconPath(iconId: number) {
        let iconObj = ICONS.filter(i => i.id == iconId)[0];
        if(!iconObj) {
            console.warn(`Could not find any profile icon with id ${iconId}`);
            iconObj = ICONS[0];
        }
        return iconObj.path;
    }
}

export function getUserdata(): UserData {
    let userdataStr = localStorage.getItem('UserData');
    let userdata;
    // If user is not already saved into localStorage, create a new one with default values
    if (!userdataStr) {
        userdata = new UserData();
        saveUserData(userdata);
    } else 
        userdata = JSON.parse(userdataStr);
    return userdata;
}
// Saves the UserData argument on localStorage
export function saveUserData(userdata: UserData) {
    localStorage.setItem('UserData', JSON.stringify(userdata));
}