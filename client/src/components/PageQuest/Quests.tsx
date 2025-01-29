export const quest_array: any[] = [
    { id: 1, coins: 6, exp: 10, title: "Traveller", description: "Visit 2 different vendors", progress: "2/2", completed: true },
    { id: 2, coins: 2, exp: 5, title: "Hiker", description: "Walk for 1000m", progress: "128/1000", completed: false },
    { id: 3, coins: 8, exp: 15, title: "Outside The Box", description: "Visit a vendor off the planned path", progress: "0/1", completed: false },
    { id: 4, coins: 4, exp: 10, title: "Harvest Hunter", description: "Purchase seasonal vegetable/fruits", progress: "1/2", completed: false },
    { id: 5, coins: 8, exp: 15, title: "Explorer", description: "Visit 3 different vendors", progress: "1/3", completed: false },
    { id: 6, coins: 4, exp: 5, title: "Backpacker", description: "Walk for 2000m", progress: "512/2000m", completed: false },
];
export function getNewQuestId(N_QUESTS: number = 3): number {
    let id: string | null = localStorage.getItem('newQuestId');
    if(id == null)
        return N_QUESTS + 1;
    return Number.parseInt(id);
}
export function saveNewQuestId(value: number = 1): number {
    let newval = (value % (quest_array.length+1)) + 1;
    localStorage.setItem('newQuestId', (newval).toString());
    return newval;
}
export function getCurrentQuests(N_QUESTS: number = 3) {
    let ls_quests: string | null = localStorage.getItem('currentQuests');
    let quests = [];
    if(ls_quests == null) {
        let n = N_QUESTS;
        quests = quest_array.slice(0, n);
        saveCurrentQuests(quests);
    } else {
        quests = JSON.parse(ls_quests);
    }
    return quests;
}
export function saveCurrentQuests(current_quests: any[]) {
    localStorage.setItem('currentQuests', JSON.stringify(current_quests));
}