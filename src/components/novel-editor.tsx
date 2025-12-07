"use client"

import dynamic from "next/dynamic";
import { type JSONContent } from "@tiptap/react";
import { type Level } from "@tiptap/extension-heading";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Editor, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "./ui/button";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dynamically import the Novel components with SSR disabled

interface NovelEditorProps {
  onChange?: (content: JSONContent) => void;
  initialContent?: JSONContent;
  placeholder?: string;
}

function NovelEditorComponent({ 
  onChange, 
  initialContent,
  placeholder = "Write something..." 
}: NovelEditorProps) {
  const debouncedOnChange = useDebouncedCallback(
    (content: JSONContent) => {
      onChange?.(content);
    },
    500
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {},
        orderedList: {},
        heading: {
          levels: [2, 3, 4, 5, 6] as Level[]
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg focus:outline-none max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedOnChange(editor.getJSON());
    },
    immediatelyRender: false
  });

  const levels: Level[] = [2, 3, 4, 5, 6];

  const HeadingDropdown = useMemo(() => {
    if (!editor) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={editor.isActive("heading") ? "bg-accent" : ""}>
            <Heading2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {levels.map((level) => (
            <DropdownMenuItem
              key={level}
              onSelect={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={editor.isActive("heading", { level }) ? "bg-accent" : ""}
            >
              <span className="flex items-center">
                {level === 2 && <Heading2 className="h-4 w-4 mr-2" />}
                {level === 3 && <Heading3 className="h-4 w-4 mr-2" />}
                {level === 4 && <Heading4 className="h-4 w-4 mr-2" />}
                {level === 5 && <Heading5 className="h-4 w-4 mr-2" />}
                {level === 6 && <Heading6 className="h-4 w-4 mr-2" />}
                Heading {level}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-muted p-2 flex gap-1 items-center">
        {HeadingDropdown}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={editor.isActive("bold") ? "bg-accent" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={editor.isActive("italic") ? "bg-accent" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBulletList}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleOrderedList}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px] p-4 prose-headings:my-3 prose-p:my-2" />
    </div>
  );
}

export const NovelEditor = dynamic(() => Promise.resolve(NovelEditorComponent), {
  ssr: false
});
