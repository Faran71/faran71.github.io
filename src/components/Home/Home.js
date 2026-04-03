import './Home.css'

export default function Home({setShowComputer}) {

    return(
        <div>
            <button onClick={() => setShowComputer(true)}>Click Me</button>
        </div>
    )
}