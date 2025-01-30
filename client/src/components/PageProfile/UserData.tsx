/* This module provide a class model for UserData and 
 * a few function for reading and writing on localstorage
 */

class UserData {
    username: string;
    coins: number;
    experience: number;

    constructor(username: string = 'user', coins: number = 1000, experience: number = 1200) {
        this.username = username;
        this.coins = coins;
        this.experience = experience;
    }

    // Use this function to increment or decrement coins
    incrCoins(increment: number): void {
        if (increment < 0 && increment > this.coins)
            this.coins = 0;
        else this.coins += increment;
    }
    // Use this function to increment or decrement experience
    incrExp(increment: number): void {
        if (increment < 0 && increment > this.experience)
            this.experience = 0;
        else this.experience += increment;
    }
}

export function getUserdata(): UserData {
    let userdataStr = localStorage.getItem('UserData');
    let userdata;
    // If user is not already saved into localStorage, create a new one with default values
    if (userdataStr == null) {
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