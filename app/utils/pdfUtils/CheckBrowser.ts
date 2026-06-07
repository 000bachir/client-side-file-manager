
export function CheckDevice() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
        let screenWidth: number = window.screen.width;
        let screenHeight: number = window.screen.height;
        isMobile = (screenWidth < 768 || screenHeight < 768);
        console.log("the device is a mobile phone")
    }
    // touch events  :
    if (!isMobile) {
        isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.maxTouchPoints > 0));
        console.log("the device is a mobile phone")

    }
    if (!isMobile) {
        let bodyElement: any = document.getElementsByTagName("body")[0];
        isMobile = window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf("mobile") !== -1
    }
    return isMobile
}


export function CheckBrowserCapacity() {
    const MinimumCpuCoresRequired : number = 1
    if (navigator.hardwareConcurrency < MinimumCpuCoresRequired ){
        throw new Error("Not enough cpu cores to handle the file at least one is required\n")
    }
}
