import AiButton from "./AiButton"

const inputClass = ".msg-form__contenteditable"

const App = () => {
    const [inputRefs, setInputRefs] = useState<HTMLDivElement[]>([])

    useEffect(() => {
        const checkForMessageInputs = () => {
            const messageInputs = Array.from(document.querySelectorAll<HTMLDivElement>(inputClass))
            setInputRefs(messageInputs)
        }

        // Check for message inputs every 1.5 seconds
        // TODO: 'MutationObserver' is a better way to do this
        setInterval(checkForMessageInputs, 1500)
    }, [])

    return inputRefs.map(inputRef => <AiButton key={inputRef.id} inputRef={inputRef} />)
}

export default App