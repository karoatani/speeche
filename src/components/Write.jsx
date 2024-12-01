import React, { useState, useEffect, useRef } from "react";
import Audio from "./Audio";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor5.css";
import Popup from "./Popup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance"; // Import axios instance
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";
import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";

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
  const { auth } = useAuth(); // Use context to get user and token
  const [loading, setLoading] = useState(false);
  const { addAuthInterceptor } = useAxiosWithAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  useEffect(() => {
    async function translateContent() {
      if (content) {
        const contentStripHtml = strip(content);
        const translatedText = await translate(
          language1code,
          language2code,
          contentStripHtml
        );
        textAreaSecondRef.current.value = translatedText;
      }
    }
    translateContent();
  }, [content]);

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
    const languageCode = languages.filter(
      (language) => Object.keys(language)[0] === value
    )[0];
    setLanguage1(value);
    setLanguage1code(languageCode[value]);
  };

  const handleSecondLanguageChange = (e) => {
    const value = e.target.value;
    const languageCode = languages.filter(
      (language) => Object.keys(language)[0] === value
    )[0];
    setLanguage2(value);
    setLanguage2code(languageCode[value]);
  };

  // Translate the content (using AI or some other translation service)
  async function translate(sourceLanguage, destinationLanguage, content) {
    if (sourceLanguage.startsWith("en")) sourceLanguage = "en";
    if (destinationLanguage.startsWith("en")) destinationLanguage = "en";

    const languagePair = {
      sourceLanguage: sourceLanguage,
      targetLanguage: destinationLanguage,
    };

    // Use your translation API here (e.g., Google Translate API or AI service)
    try {
      const translator = await ai.translator.create(languagePair); // This should be a valid translation API call
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

  const mutation = useMutation({
    mutationFn: async (newContent) => {
      await axiosInstance.post("import/", newContent);
    },
  });

  const onSuccess = () => {
    toast.success("Successful", { toastId: "success" });
    // navigate("/dashboard");
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      onSuccess();
    }
  }, [mutation.isSuccess]);

  useEffect(() => {
    if (mutation.isError) {
      console.log(mutation.error.message);
      toast.error("Error", { toastId: "error" });
    }
  }, [mutation.isError]);

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
    
    const anthropic = new Anthropic({dangerouslyAllowBrowser: true , apiKey: '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'});

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      system: "Respond only with short poems.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Why is the ocean salty?",
            },
          ],
        },
      ],
    });
    console.log(msg);
  };

  return (
    <div className=" w-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {opened ? (
        <Popup
          setOpened={setOpened}
          handleSaveToDb={handleSaveToDb}
          mutation={mutation}
        />
      ) : null}

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
            <button className="bg-[#FBFB5C] hover:bg-purple-600 px-4 py-2 rounded shadow cursor-pointer">
              Summarize
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
