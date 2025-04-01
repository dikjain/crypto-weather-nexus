'use client';
import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";
import { motion } from "framer-motion";

const STAGGER_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const NewsComponent = () => {
  const { newsData } = useStore();

  useEffect(() => {
    if (!newsData || newsData.length === 0) {
      toast.error("Failed to load news data");
    }
  }, [newsData]);

  return (
    <motion.section 
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-orbitron)" }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Crypto News
      </motion.h2>
      <div className="space-y-4">
        {!newsData ? (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        ) : newsData.length > 0 ? (
          newsData.map((article, index) => (
            <motion.article 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * STAGGER_DELAY }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow"
            >
              <h3 className="font-medium text-lg line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {article.description}
              </p>
              <motion.div 
                className="mt-3 flex justify-between items-center text-xs text-gray-500"
                whileHover={{ x: 2 }}
              >
                <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                <motion.a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                  whileHover={{ x: 3 }}
                  onClick={(e) => {
                    if (!article.link) {
                      e.preventDefault();
                      toast.error("Invalid article link");
                    }
                  }}
                >
                  Read More 
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </motion.div>
            </motion.article>
          ))
        ) : (
          <motion.div 
            className="text-center py-8 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>No news articles available</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default NewsComponent;
