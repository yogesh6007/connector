import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { SKILLS_LIST } from '../../utils/constants';

export default function SkillTagInput({
  selectedSkills = [],
  onChange,
  label = 'Skills & Technologies',
  placeholder = 'Add skill (e.g. Python, React)...',
  max = 10
}) {
  const [inputVal, setInputVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = SKILLS_LIST.filter(
    (skill) =>
      skill.toLowerCase().includes(inputVal.toLowerCase()) &&
      !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
  ).slice(0, 6);

  const addSkill = (skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase()) && selectedSkills.length < max) {
      onChange([...selectedSkills, trimmed]);
    }
    setInputVal('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">{label}</label>}

      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px]">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-indigo-400 hover:text-indigo-700 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selectedSkills.length === 0 && (
          <span className="text-xs text-slate-400 italic py-1">No skills added yet</span>
        )}
      </div>

      {/* Input bar */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(inputVal);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <button
            type="button"
            onClick={() => addSkill(inputVal)}
            disabled={!inputVal.trim() || selectedSkills.length >= max}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && inputVal && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
