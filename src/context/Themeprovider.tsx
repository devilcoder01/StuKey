
import React, { createContext, useContext, useState, useEffect } from 'react';

const interface 

const ThemeContext = createContext<string | undefined>(undefined);


const ThemeProvider: React.FC< {children: React.ReactNode}> = ({children}) => {
    const {theme, setTheme} = useState();
    
    return(
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    )
}