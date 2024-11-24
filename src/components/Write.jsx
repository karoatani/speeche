import React, { useState, useEffect, useRef } from "react";
import Audio from "./Audio";

const Write = () => {
  const [language1, setLanguage1] = useState("English Us");
  const [language1code, setLanguage1code] = useState("en-US");

  const [language2, setLanguage2] = useState("Japanese");
  const [importOptions, setImportOptions] = useState([]);
  const [selectedImport, setSelectedImport] = useState("");
  const [content, setContent] = useState("");
  const textAreaRef = useRef(null);

//   useEffect(() => {
//     const fetchImportOptions = async () => {
//       try {
//         const response = await fetch("/api/import-options");
//         const data = await response.json();
//         setImportOptions(data);
//       } catch (error) {
//         console.error("Error fetching import options:", error);
//       }
//     };
//     fetchImportOptions();
//   }, []);

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
  };
  const languages = [
    {
      "English Australia": "en-AU",
    },
    { "English Canada": "en-CA" },
    { "English India": "en-IN" },
    { "English New Zealand": "en-NZ" },
    { "English South Africa": "en-ZA" },
    { "English Uk": "en-GB" },
    { "English Us": "en-US" },
    { Japanese: "ja" },
  ];

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    const languageCode = languages.filter(
      (language) => Object.keys(language)[0] == value
    )[0];
    setLanguage1(value);

    setLanguage1code(languageCode[value]);
  };
  async function translate(sourceLanguage, destinationLanguage) {
    if (sourceLanguage.startsWith("en")) sourceLanguage = "en";
    if (destinationLanguage.startsWith("en")) destinationLanguage = "en";

    const languagePair = {
      sourceLanguage: "en",
      targetLanguage: "ja",
    };

    const canTranslate = await translation.canTranslate(languagePair);
    
    let translator;
    if (canTranslate !== "no") {
      if (canTranslate === "readily") {
        console.log(canTranslate);
        // The translator can immediately be used.
        translator = await translation.createTranslator(languagePair);
        console.log("testing..................");
        const translation = await translator.translate("hello abibi");
        console.log(translation);
      }
    }
    // return translator;
  };

  translate(language1, language2);

  
  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-6xl max-h-[90vh] bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">
            Translate Interface
          </h1>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow">
            Export
          </button>
        </div>

        <div className="flex-grow grid grid-cols-2 gap-4">
          <div className="flex flex-col h-full">
            <select
              className="bg-gray-700 text-gray-200 p-2 rounded-md mb-2"
              value={language1}
              onChange={(e) => handleLanguageChange(e)}
            >
              {languages.map((item) => (
                <option key={Object.values(item)[0]}>
                  {Object.keys(item)[0]}
                </option>
              ))}
            </select>

            <textarea
              className="flex-grow bg-gray-700 text-gray-200 p-4 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Write here..."
              value={content} // Bind content to the textarea
              onChange={handleTextareaChange} // Update content via typing
              ref={textAreaRef}
            ></textarea>
          </div>

          <div className="flex flex-col h-full">
            <select
              className="bg-gray-700 text-gray-200 p-2 rounded-md mb-2"
              value={language2}
              onChange={(e) => setLanguage2(e.target.value)}
            >
              {languages.map((item) => (
                <option key={Object.values(item)[0]}>
                  {Object.keys(item)[0]}
                </option>
              ))}
            </select>
            <textarea
              className="flex-grow bg-gray-700 text-gray-200 p-4 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Translation will appear here..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="importData"
              className="text-gray-200 font-medium mr-2"
            >
              Import Data:
            </label>
            <select
              id="importData"
              className="bg-gray-700 text-gray-200 p-2 rounded-md"
              value={selectedImport}
              onChange={(e) => setSelectedImport(e.target.value)}
            >
              <option value="" disabled>
                Select an option
              </option>
              {importOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Audio setContent={setContent} language1code={language1code} />
        </div>
      </div>
    </div>
  );
};

export default Write;
