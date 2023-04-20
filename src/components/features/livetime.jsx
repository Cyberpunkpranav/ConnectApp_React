import '../../css/livetime.css'
function Livetime() {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var weekday = [["Sunday", '0'], ["Monday", '1'], ["Tuesday", '2'], ["Wednesday", '3'], ["Thursday", '4'], ["Friday", '5'], ["Saturday", '6']]
    const d = new Date()
    let monthname = month[d.getMonth()]
    var weekname = weekday[d.getDay()][0]
    var fullDate = new Date()
    var currentDate = monthname + " " + fullDate.getDate() + "," + fullDate.getFullYear() + " " + weekname
    return (
        <div className="livetime p-2">{currentDate}</div>
    )
}
export { Livetime }