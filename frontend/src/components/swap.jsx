"use client"

import { useEffect, useState, useContext } from "react"
import { Button } from "./ui/button"
import { UserContext } from "@/components/userContext"
import { ChevronDownIcon, ArrowDownIcon } from "lucide-react"

export function Swap() {
  const { userData } = useContext(UserContext)
  const [tokens, setTokens] = useState([])
  const [selectedFromToken, setSelectedFromToken] = useState(null)
  const [selectedToToken, setSelectedToToken] = useState(null)
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false)
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false)
  const [velarTokens, setVelarTokens] = useState([]);

  useEffect(() => {
    function getData() {
      fetch("https://api.hiro.so/metadata/v1/ft?address=SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9&offset=0&limit=20&order_by=name&order=asc", {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          setTokens(data.results)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }
    getData()
  }, []);

  useEffect(() => {
    function getData() {
      fetch("https://api.velar.co/tokens/?symbol=all", {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          setVelarTokens(data.results)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }
    getData()
  }, []);

  const handleFromTokenSelect = (token) => {
    setSelectedFromToken(token)
    setIsFromDropdownOpen(false)
  }

  const handleToTokenSelect = (token) => {
    setSelectedToToken(token)
    setIsToDropdownOpen(false)
  }

  const toggleFromDropdown = () => {
    setIsFromDropdownOpen(!isFromDropdownOpen)
    setIsToDropdownOpen(false)
  }

  const toggleToDropdown = () => {
    setIsToDropdownOpen(!isToDropdownOpen)
    setIsFromDropdownOpen(false)
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#0F0F0F] text-white overflow-y-auto py-10">
      <main className="w-full max-w-md p-6 bg-[#171717] rounded-2xl shadow-lg mb-20">
        <h2 className="text-2xl font-bold mb-2">Swap</h2>
        <p className="text-gray-400 mb-4">Exchange assets on Stacks.</p>
        
        <div className="bg-[#1E1E1E] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">From</div>
            <div className={`text-sm ${userData ? 'text-green-500' : 'text-red-500'}`} aria-live="polite">
              {userData ? 'Connected' : 'Not Connected'}
            </div>
          </div>
  
          {/* From Dropdown */}
          <div className="relative mb-4">
            <button 
              className="w-full bg-[#2D2D2D] p-3 rounded-lg cursor-pointer flex justify-between items-center transition-shadow duration-200 hover:shadow-lg"
              onClick={toggleFromDropdown}
              aria-haspopup="listbox"
              aria-expanded={isFromDropdownOpen}
            >
              {selectedFromToken ? (
                <div className="flex items-center">
                  <img src={selectedFromToken.image_uri} alt="" className="w-6 h-6 mr-2" />
                  <span>{selectedFromToken.name}</span>
                </div>
              ) : (
                <span className="text-gray-400">Select a token</span>
              )}
              <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            {isFromDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-[#2D2D2D] rounded-lg shadow-lg max-h-60 overflow-y-auto border border-[#3D3D3D]" role="listbox">
                {tokens.map((token) => (
                  <button
                    key={`from-${token.symbol}`}
                    className="w-full flex items-center p-3 hover:bg-[#3D3D3D] cursor-pointer transition-colors duration-200 text-left"
                    onClick={() => handleFromTokenSelect(token)}
                    role="option"
                    aria-selected={selectedFromToken?.symbol === token.symbol}
                  >
                    <img src={token.image_uri} alt="" className="w-6 h-6 mr-2" />
                    <span>{token.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
  
          <input
            type="number"
            placeholder="0.0000"
            className="bg-transparent text-white w-full p-3 rounded-lg mb-4 border border-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#9B51E0]"
            aria-label="Amount to swap from"
          />
  
          {/* Arrow icon */}
          <div className="flex justify-center my-4">
            <ArrowDownIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
          </div>
  
          {/* To Dropdown */}
          <div className="relative mb-4">
            <button 
              className="w-full bg-[#2D2D2D] p-3 rounded-lg cursor-pointer flex justify-between items-center transition-shadow duration-200 hover:shadow-lg"
              onClick={toggleToDropdown}
              aria-haspopup="listbox"
              aria-expanded={isToDropdownOpen}
            >
              {selectedToToken ? (
                <div className="flex items-center">
                  <img src={selectedToToken.image_uri} alt="" className="w-6 h-6 mr-2" />
                  <span>{selectedToToken.name}</span>
                </div>
              ) : (
                <span className="text-gray-400">Select a token</span>
              )}
              <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            {isToDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-[#2D2D2D] rounded-lg shadow-lg max-h-60 overflow-y-auto border border-[#3D3D3D]" role="listbox">
                {tokens.map((token) => (
                  <button
                    key={`to-${token.symbol}`}
                    className="w-full flex items-center p-3 hover:bg-[#3D3D3D] cursor-pointer transition-colors duration-200 text-left"
                    onClick={() => handleToTokenSelect(token)}
                    role="option"
                    aria-selected={selectedToToken?.symbol === token.symbol}
                  >
                    <img src={token.image_uri} alt="" className="w-6 h-6 mr-2" />
                    <span>{token.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
  
          <input
            type="number"
            placeholder="0.0000"
            className="bg-transparent text-white w-full p-3 rounded-lg mb-4 border border-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#9B51E0]"
            aria-label="Amount to swap to"
          />
  
          <Button 
            className="w-full bg-[#9B51E0] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#8A46C7] transition-colors duration-200" 
            onClick={() => console.log('Swap action')}
          >
            {userData ? `Swap ${selectedFromToken ? selectedFromToken.symbol : 'Tokens'}` : 'Connect Wallet'}
          </Button>
        </div>
      </main>
    </div>
  )
}