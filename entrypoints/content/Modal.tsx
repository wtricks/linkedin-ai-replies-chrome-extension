interface ModalProps {
    onInsert: (value: string) => void
    onClose: () => void
    show: boolean
}

const Modal = ({ onInsert, onClose, show }: ModalProps) => {
    const [value, setValue] = useState('');
    const [chatList, setChatList] = useState<{ message: string, by: 'ai' | 'user' }[]>([]);

    const onInsertButtonClick = () => {
        onInsert(chatList[chatList.length - 1].message);
        setChatList([]);
        setValue('');
    }

    const onGenerateButtonClick = () => {
        if (value.trim() && chatList.length === 0) {
            setChatList(chatList => ([...chatList, { message: value, by: 'user' }]));
            setValue('');

            // Mimic AI response
            setTimeout(() => {
                setChatList(chatList => ([...chatList, { 
                    message: 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.', 
                    by: 'ai' 
                }]));
            }, 500);
        }
    }

    const onOutsideClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
            setChatList([])
            setValue('')
            onClose()
        }
    }

    if (!show) {
        return null
    }

    return (
        <div onClick={onOutsideClick as any} className="fixed inset-0 px-6 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-xl">
                <ul className={`w-full ${chatList.length === 0 ? '' : 'mb-6'}`}>
                    {chatList.map((chat, index) => (
                        <li key={index} className={`font-sans mb-5 p-4 w-full rounded-lg last:mb-0 text-slate-500 max-w-[75%] ${chat.by === 'user' ? 'ml-auto bg-gray-200' : 'bg-blue-100'}`}>
                            {chat.message}
                        </li>
                    ))}
                </ul>

                <input
                    type="text"
                    id="modal-input"
                    placeholder="Write prompt"
                    className="!py-3.5 !leading-normal !text-md !font-medium !h-auto !px-4 !rounded-lg placeholder:text-gray-300 !border !border-solid !border-gray-400 !outline-0 !text-gray-700 !shadow-none"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <div className="flex justify-end mt-5">
                    {chatList.length == 2 && (
                        <button
                            className="hover:opacity-80 active:scale-95 text-gray-500 border border-solid border-gray-500 font-medium py-2.5 px-5 rounded-lg flex items-center"
                            onClick={onInsertButtonClick}
                        >
                            <svg className="size-6 mr-3" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="fill-gray-500" d="M6.1 12.3666V1.43331C6.1 1.05553 6.228 0.739087 6.484 0.483976C6.74 0.228865 7.05644 0.100864 7.43333 0.0999756C7.81111 0.0999756 8.128 0.227976 8.384 0.483976C8.64 0.739976 8.76756 1.05642 8.76667 1.43331V12.3666L12.6333 8.49998C12.8778 8.25553 13.1889 8.13331 13.5667 8.13331C13.9444 8.13331 14.2556 8.25553 14.5 8.49998C14.7444 8.74442 14.8667 9.05553 14.8667 9.43331C14.8667 9.81109 14.7444 10.1222 14.5 10.3666L8.36667 16.5C8.1 16.7666 7.78889 16.9 7.43333 16.9C7.07778 16.9 6.76667 16.7666 6.5 16.5L0.366666 10.3666C0.122222 10.1222 0 9.81109 0 9.43331C0 9.05553 0.122222 8.74442 0.366666 8.49998C0.611111 8.25553 0.922222 8.13331 1.3 8.13331C1.67778 8.13331 1.98889 8.25553 2.23333 8.49998L6.1 12.3666Z"/>
                            </svg>
                            <span>Insert</span>
                        </button>
                    )}
                    <button
                        className="bg-blue-500 hover:opacity-80 active:scale-95 text-white font-medium py-2.5 px-5 rounded-lg ml-3 flex items-center"
                        onClick={onGenerateButtonClick}
                    >
                        {chatList.length != 2 ? <svg className="size-6 mr-3" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.456 11.6075L2.45599 0.607504C2.28356 0.521271 2.08988 0.486719 1.89827 0.508009C1.70665 0.529299 1.52528 0.605523 1.37599 0.727504C1.23341 0.846997 1.12699 1.00389 1.0687 1.18055C1.0104 1.35721 1.00254 1.54662 1.04599 1.7275L4.00599 12.4975L1.00599 23.2375C0.965214 23.3886 0.960455 23.5471 0.992092 23.7003C1.02373 23.8535 1.09088 23.9972 1.18815 24.1198C1.28541 24.2423 1.41008 24.3403 1.55212 24.4059C1.69416 24.4715 1.84962 24.5029 2.00599 24.4975C2.16253 24.4966 2.31667 24.4589 2.45599 24.3875L24.456 13.3875C24.6198 13.3036 24.7573 13.1761 24.8532 13.0191C24.9492 12.862 25 12.6816 25 12.4975C25 12.3135 24.9492 12.133 24.8532 11.9759C24.7573 11.8189 24.6198 11.6914 24.456 11.6075ZM3.55599 21.6075L5.76599 13.4975H15.006V11.4975H5.76599L3.55599 3.3875L21.766 12.4975L3.55599 21.6075Z" fill="white" />
                        </svg>
                            : <svg className="size-8 mr-3" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 3.24541V0L4.25 4.32724L8.5 8.65459V5.40903C12.006 5.40903 14.875 8.32995 14.875 11.9C14.875 12.9818 14.6094 14.0098 14.131 14.929L15.6719 16.4978C16.5217 15.1454 17 13.5766 17 11.9C17 7.14005 13.1749 3.24541 8.5 3.24541ZM8.5 18.391C4.9937 18.391 2.125 15.4698 2.125 11.9C2.125 10.8182 2.39062 9.79046 2.8687 8.87081L1.32812 7.30224C0.478072 8.60041 0 10.2232 0 11.9C0 16.6599 3.82511 20.5546 8.5 20.5546V23.8L12.75 19.4728L8.5 15.1454V18.391Z" fill="white" />
                            </svg>}
                        <span>{chatList.length != 2 ? 'Generate' : 'Regenerate'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal