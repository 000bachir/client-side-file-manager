export function checkingForMissingElement(elements : any){
    Object.entries(elements).filter(([name , element])=> !element ).map(([name ]) => name)

    if(elements.length){
          console.error(`Missing elements: ${elements.join(', ')}`);
    }
}