import { Quest } from "../../models";


export const quest_array: Quest[] = [
    { id: 1, coins: 50, exp: 100, title: "Traveller", description: "Visit 2 different vendors", progress: "2/2", completed: true },
    { id: 2, coins: 50, exp: 50, title: "Hiker", description: "Walk for 1000m", progress: "128/1000", completed: false },
    { id: 3, coins: 150, exp: 100, title: "Fisherman", description: "Complete a purchase from a fishmonger", progress: "1/1", completed: true },
    { id: 4, coins: 100, exp: 150, title: "Harvest Hunter", description: "Purchase seasonal vegetable/fruits", progress: "1/2", completed: false },
    { id: 5, coins: 150, exp: 150, title: "Explorer", description: "Visit 3 different vendors", progress: "1/3", completed: false },
    { id: 6, coins: 50, exp: 50, title: "Backpacker", description: "Walk for 2000m", progress: "512/2000", completed: false },
];
export function getNewQuestId(N_QUESTS: number = 3): number {
    const id: string | null = localStorage.getItem('newQuestId');
    if (id == null)
        return N_QUESTS;
    return Number.parseInt(id);
}
function nextQuestId(id: number): number {
    return (id % (quest_array.length)) + 1;
}
/* Find a new quest ID which is not already in current_quest,
 * then return it
 */
export function getAndSaveNewQuestId(value: number = 1): number {
    const current_quests_ids = getCurrentQuests().map(q => q.id);
    let newval = nextQuestId(value);
    if(current_quests_ids.length == quest_array.length) {
        throw new Error("N_QUEST must be strictly less than quest_array.length");
    }
    while(current_quests_ids.includes(newval))
        newval = nextQuestId(newval);
    localStorage.setItem('newQuestId', newval.toString());
    return newval;
}

export function getCurrentQuests(N_QUESTS: number = 3): Quest[] {
    const ls_quests: string | null = localStorage.getItem('currentQuests');
    let quests = [];
    if (ls_quests == null) {
        const n = N_QUESTS;
        quests = quest_array.slice(0, n);
        saveCurrentQuests(quests);
    } else {
        quests = JSON.parse(ls_quests);
    }
    return quests;
}
export function saveCurrentQuests(current_quests: Quest[]) {
    localStorage.setItem('currentQuests', JSON.stringify(current_quests));
}