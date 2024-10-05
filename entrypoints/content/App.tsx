import AiButton from "./AiButton"
import { checkAndAddKey } from "@/utils/helper"

const inputClass = ".msg-form__contenteditable"

const App = () => {
    const [inputRefs, setInputRefs] = useState<{value: HTMLDivElement, key: number}[]>([])

    useEffect(() => {
        const checkForMessageInputs = () => {
            const messageInputs = Array.from(document.querySelectorAll<HTMLDivElement>(inputClass))
            setInputRefs(prev => checkAndAddKey(prev, messageInputs)) // helpful to avoid duplicate key
        }

        // Check for message inputs every 1.5 seconds
        // TODO: 'MutationObserver' is a better way to do this
        setInterval(checkForMessageInputs, 1500)
    }, [])

    return inputRefs.map(inputRef => <AiButton key={inputRef.key} inputRef={inputRef.value} />)
}

export default App