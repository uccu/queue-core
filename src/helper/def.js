module.exports = (t, o) => {
    for (let i in o) Object.defineProperty(t, i, { value: o[i] })
}