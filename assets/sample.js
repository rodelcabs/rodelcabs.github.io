const search = (searchKey, string) => {
    string = [...string];
    cnt = 0
    for(key of string){
        if (key == searchKey){
            cnt++;
        }
    }
    return cnt;
}

console.log(search('e', 'management'));