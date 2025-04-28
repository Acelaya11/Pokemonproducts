'use client'

import React from 'react';
import Image from 'next/image';
import { Category } from './ssr/advanced-filter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

interface SidebarProps {
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
}

export default function Sidebar({ categories, onCategoryChange }: SidebarProps) {
  const productCategories = categories.filter(cat => cat.type === 'product');
  const energyCategories = categories.filter(cat => cat.type === 'energy');
  const rarityCategories = categories.filter(cat => cat.type === 'rarity');
  const extraCategories = categories.filter(cat => cat.type === 'extra');
  const sealedTypeCategories = categories.filter(cat => cat.type === 'sealed_type');
  const seriesCategories = categories.filter(cat => cat.type === 'series');
  const psaGradeCategories = categories.filter(cat => cat.type === 'psa_grade');

  const isAllSelected = categories.find(cat => cat.id === 'all')?.checked;
  const isCardsSelected = categories.find(cat => cat.id === 'cards')?.checked;
  const isSealedSelected = categories.find(cat => cat.id === 'sealed')?.checked;

  return (
    <div className="w-full md:w-44 lg:w-44 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white my-4 rounded-lg p-4 md:p-4 shadow-lg shadow-zinc-700">
      <h2 className="text-xl font-bold mb-4">Categories</h2>

      {/* Product Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Product Type</h3>
        <div className="space-y-2">
          {productCategories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={category.checked}
                onChange={() => onCategoryChange(category.id)}
                className="form-checkbox text-purple-600 rounded border-gray-400 focus:ring-purple-500"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Categories (only shown when cards are selected and all is not selected) */}
      {isCardsSelected && !isAllSelected && (
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="psa">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              PSA Grade
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {psaGradeCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="energy">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Energy Types
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {energyCategories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-sm flex items-center gap-2">
                      {category.image && (
                        <Image 
                          src={category.image} 
                          alt={category.name} 
                          width={20} 
                          height={20}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                      )}
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rarity">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Rarity
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {rarityCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="extra">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Extras
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {extraCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Sealed Product Categories (only shown when sealed products are selected and all is not selected) */}
      {isSealedSelected && !isAllSelected && (
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="product-type">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Product Types
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {sealedTypeCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="series">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Series
            </AccordionTrigger>
            <AccordionContent>
              {seriesCategories.map((category) => (
                <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.checked}
                    onChange={() => onCategoryChange(category.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
} 