export interface Result {
    id : number 
    name : string 
    status : "converting" | "done" | "error"
    originalSize : number 
    newSize? : number
    url? : string
}