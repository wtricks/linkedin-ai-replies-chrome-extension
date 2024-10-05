import Logo from '@/assets/logo.png';

const App = () => {
    const onGetStarted = () => {
        console.log('onGetStarted');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50 min-w-[350px] w-full max-w-lg">
            <h1 className="text-3xl font-bold text-gray-800 mt-16 text-center">
                Welcome to <blockquote className="italic bg-gradient-to-t from-blue-500 to-purple-500 bg-clip-text text-transparent">LinkedIn AI Reply</blockquote>
            </h1>
            <p className="mt-4 text-gray-600 text-center text-lg">
                Enhance your LinkedIn messaging experience with AI-powered replies.
            </p>
        </div>
    );
}

export default App;
