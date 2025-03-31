'use client';
import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";

const NewsComponent = () => {
  const { newsData } = useStore();

  useEffect(() => {
    if (!newsData || newsData.length === 0) {
      toast.error("Failed to load news data");
    }
  }, [newsData]);

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Crypto News</h2>
      <div className="space-y-4">
        {newsData.map((article, index) => (
          <article 
            key={index} 
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-medium text-lg line-clamp-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {article.description}
            </p>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(article.pubDate).toLocaleDateString()}</span>
              <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  if (!article.link) {
                    e.preventDefault();
                    toast.error("Invalid article link");
                  }
                }}
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
        {newsData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No news articles available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsComponent;
