
export async function CheckDevice() {
    let signals: boolean[] = [];
    let MobilePattern: any = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    signals.push(MobilePattern)

    // 2- screen dimension 
    const ScreenWidth: number = window.screen.width;
    const ScreenHeight: number = window.screen.height;
    signals.push(Math.min(ScreenWidth, ScreenHeight) < 768);

    // touch capacity : 
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    signals.push(hasTouch)

    // css media queary : 
    const viewPort = window.matchMedia(
        "(max-width : 768px); , (hover : none);"
    )
    signals.push(viewPort.matches)
    // checking css content 
    const bodyContent = window.getComputedStyle(document.body).getPropertyValue("content")
    if (bodyContent.includes("mobile")) signals.push(true)

    const mobileVotes = signals.filter(Boolean).length
    const isMobile = mobileVotes >= Math.ceil(signals.length / 2);
    if (import.meta.env.DEV) {
        console.table(
            signals.map((v, i) => ({
                signal: ["userAgent", "screenSize", "touch", "mediaQuery", "pixelRatio", "cssContent"][i],
                isMobile: v,
            }))
        );
        console.log(`Mobile votes: ${mobileVotes}/${signals.length} → isMobile: ${isMobile}`);
    }

    return isMobile;
}




export async function CheckBrowserCapacity() : Promise<boolean> {
    const MinimumCpuCoresRequired: number = 1
    if (navigator.hardwareConcurrency < MinimumCpuCoresRequired) {
        throw new Error("Not enough cpu cores to handle the file at least one is required\n")
    }
    return true
}
