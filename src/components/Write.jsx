import React, { useState, useEffect, useRef, useCallback } from "react";
import Audio from "./Audio";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor5.css";
import Popup from "./Popup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Write = () => {
  const [language1, setLanguage1] = useState("English Us");
  const [language1code, setLanguage1code] = useState("en-US");

  const [language2, setLanguage2] = useState("Japanese");
  const [language2code, setLanguage2code] = useState("ja");

  const [importOptions, setImportOptions] = useState([]);
  const [selectedImport, setSelectedImport] = useState("");
  const [content, setContent] = useState("");
  const [jobid, setJobId] = useState("");
  const [title, setTitle] = useState("");

  const [opened, setOpened] = useState(false);
  const textAreaSecondRef = useRef(null);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [summarize, setSummarize] = useState(false);
  const { addAuthInterceptor } = useAxiosWithAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  const translateContent = useCallback(
    debounce(async (contentValue) => {
      if (contentValue) {
        const contentStripHtml = strip(contentValue);
        const translatedText = await translate(
          language1code,
          language2code,
          contentStripHtml
        );
        textAreaSecondRef.current.value = translatedText;
      } else {
        // Clear the second textarea when the first one is empty
        textAreaSecondRef.current.value = "";
      }
    }, 300), // Debounce delay in milliseconds
    [language1code, language2code]
  );

  useEffect(() => {
    translateContent(content);
  }, [content, translateContent]);

  const languages = [
    { "English Australia": "en-AU" },
    { "English Canada": "en-CA" },
    { "English India": "en-IN" },
    { "English New Zealand": "en-NZ" },
    { "English South Africa": "en-ZA" },
    { "English Uk": "en-GB" },
    { "English Us": "en-US" },
    { Japanese: "ja" },
  ];

  function strip(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    const languageCode = languages.find(
      (language) => Object.keys(language)[0] === value
    );
    setLanguage1(value);
    setLanguage1code(languageCode[value]);
  };

  const handleSecondLanguageChange = (e) => {
    const value = e.target.value;
    const languageCode = languages.find(
      (language) => Object.keys(language)[0] === value
    );
    setLanguage2(value);
    setLanguage2code(languageCode[value]);
  };

  async function translate(sourceLanguage, destinationLanguage, content) {
    if (sourceLanguage.startsWith("en")) sourceLanguage = "en";
    if (destinationLanguage.startsWith("en")) destinationLanguage = "en";

    const languagePair = {
      sourceLanguage: sourceLanguage,
      targetLanguage: destinationLanguage,
    };

    try {
      const translator = await ai.translator.create(languagePair);
      const translation = await translator.translate(content);
      return translation;
    } catch (error) {
      console.error("Translation error:", error);
      return "Translation failed!";
    }
  }

  const handleSave = () => {
    setOpened(true);
  };

  
  
  const handleSaveToDb = () => {
    mutation.mutate({
      title: title,
      user: auth.user.user_id,
      content: content,
      content2: textAreaSecondRef.current.value,
    });

    setOpened(false);
    setTitle("");
    setContent("");
    textAreaSecondRef.current.value = "";
  };
  

  const handleProofread = async () => {
    // Start by checking if it's possible to create a session based on the availability of the model, and the characteristics of the device.
    const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();

    if (available !== "no") {
      setLoading(true);
      const session = await ai.languageModel.create({
        systemPrompt: `You are a language proofreading expert. Your task is to proofread the given content for spelling, punctuation, grammar, and overall readability. The content contains HTML tags. You must ignore the tags when proofreading the text but retain them in their original positions to preserve the formatting.

Instructions:

1. Only proofread the text within the HTML tags.

2. Correct all spelling, punctuation, and grammar errors in the text.

3. Ensure the content is clear and maintains proper sentence structure.

4. Do not modify the HTML tags or their structure in any way.

5. Return the content with the proofread text inside the original HTML tags.`
      });
      
      const result = await session.prompt(content);
      
      setContent(result);
      setLoading(false);
  
}

  };

  const handleSummarize = async (content) => {
    const canSummarize = await ai.summarizer.capabilities();
    let summarizer;
    if (canSummarize && canSummarize.available !== "no") {
      setSummarize(true);
      if (canSummarize.available === "readily") {
        summarizer = await ai.summarizer.create();
      } else {
        summarizer = await ai.summarizer.create();
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }

      if (!content) return;
      
      const result = await summarizer.summarize(content);
      setContent(result);
      setSummarize(false);
      summarizer.destroy();
    }
  };

  const mutation = useMutation({
    mutationFn: async (newContent) => {
      await axiosInstance.post("import/", newContent);
    },
    onError: () => {toast.error('Error saving', {toastId: "error"})},
    onSuccess: ()=> {toast.success('Saved Sucessfully', {toastId: "success"});}
  });

  return (
    <div className="w-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {opened && (
        <Popup
          setOpened={setOpened}
          setTitle={setTitle}
          handleSaveToDb={handleSaveToDb}
          mutation={mutation}
        />
      )}

      <div
        className={`w-full h-full max-w-6xl max-h-[90vh] bg-gray-800 ${
          opened ? "opacity-5" : ""
        } rounded-lg shadow-lg p-6 flex flex-col space-y-6 transition-all ease-in-out delay-150 duration-300`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">
            Translate Interface
          </h1>
        </div>

        <div className="flex-grow grid grid-cols-2 gap-4">
          <div className="flex flex-col h-full">
            <select
              className="bg-gray-700 text-gray-200 p-2 rounded-md mb-2"
              value={language1}
              onChange={handleLanguageChange}
            >
              {languages.map((item) => (
                <option key={Object.values(item)[0]}>
                  {Object.keys(item)[0]}
                </option>
              ))}
            </select>

            <div className="flex-grow">
              <CKEditor
                editor={ClassicEditor}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "blockQuote",
                    "insertTable",
                    "mediaEmbed",
                    "undo",
                    "redo",
                    "alignment",
                    "fontSize",
                    "fontColor",
                    "fontBackgroundColor",
                  ],
                }}
                data={content}
                onChange={(event, editor) => setContent(editor.getData())}
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <select
              className="bg-gray-700 text-gray-200 p-2 rounded-md mb-2"
              value={language2}
              onChange={handleSecondLanguageChange}
            >
              {languages.map((item) => (
                <option key={Object.values(item)[0]}>
                  {Object.keys(item)[0]}
                </option>
              ))}
            </select>
            <textarea
              className="flex-grow p-4 border border-gray-600 rounded-md focus:outline-none"
              placeholder="Translation will appear here..."
              ref={textAreaSecondRef}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Audio setContent={setContent} language1code={language1code} />
            <button
              className="bg-[#FBFB5C] hover:bg-purple-600 px-4 py-2 rounded shadow cursor-pointer"
              onClick={() => handleSummarize(content)}
            >
              {summarize ? "Summarizing..." : "Summarize"}
            </button>
            <button
              className="bg-black hover:bg-purple-600 text-white px-4 py-2 rounded shadow cursor-pointer"
              onClick={handleProofread}
            >
              {loading ? "Proofreading..." : "Proofread"}
            </button>
            <button
              className="bg-red-400 hover:bg-purple-600 text-white px-4 py-2 rounded shadow cursor-pointer"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
