export function autoScrollFun(scrollEl, el) {
    // 不存在时不执行
    if (!scrollEl || !el ) return false;

    function getElementTop(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return actualTop;
    }
    // 滚动条容器，视窗高度
    let clientHeight = scrollEl.clientHeight;
    let topLen = clientHeight * 0.25;    // 视窗高度的 四分之一
    let bottomLen = clientHeight * 0.75; // 视窗高度的 四分之三
    // 滚动元素，滚动高度
    let scrollTop = scrollEl.scrollTop;
    // 滚动元素，最顶部
    let scrollOffsetTop = getElementTop(scrollEl) + scrollTop;

    // 距离滚动元素视窗上距离
    let positionTop = getElementTop(el) - scrollOffsetTop;
    // 点击元素，距滚动元素最顶部距离
    let top = positionTop + scrollTop;
    
    if (positionTop <= topLen || positionTop >= bottomLen) {
        // console.log(scrollOffsetTop, el.offsetTop, positionTop, topLen, bottomLen)
        scrollEl.scrollTo({
            top: top - topLen,
            behavior: 'smooth',
        })
    }

    // if (positionTop <= topLen) {
    //     console.log(top, scrollTop)
    //     scrollEl.scrollTo({
    //         top: top - topLen,
    //         behavior: 'smooth',
    //     })
    // } else if(positionTop >= bottomLen) {
    //     console.log(top, scrollTop, top - bottomLen)
    //     scrollEl.scrollTo({
    //         top: top - bottomLen,
    //         behavior: 'smooth',
    //     })
    // }
} 