import { Outlet } from 'react-router-dom'
import LanguageToggle from '../../utils/LanguageToggle'

const Auth = () => {
    return (
        <div className="bg-gradient-to-br from-red-300 to-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Outlet/>
        </div>
    )
}

export default Auth
