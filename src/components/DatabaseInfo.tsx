import React, { useState, useEffect } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { databaseService } from '../utils/databaseService';
import { DatabaseStats } from '../types';

const DatabaseInfo: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dbStats = await databaseService.getDatabaseStats();
      setStats(dbStats);
    } catch (error) {
      console.error('Failed to load database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all stored analysis data? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      await databaseService.clearAllData();
      console.log('Database cleared successfully');
      // Reload stats to reflect the empty database
      await loadStats();
      alert('Database cleared successfully! All stored analysis data has been removed.');
    } catch (error) {
      console.error('Failed to clear database:', error);
      alert('Failed to clear database. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading || !stats) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Your Analysis History</h3>
            <p className="text-xs text-blue-700">
              {stats.totalAnalyses} total analyses • {stats.recentAnalyses} this week
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-xs text-blue-700">
            <div className="text-center">
              <div className="font-bold text-blue-900">{stats.fractureDetected}</div>
              <div>Fractures</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-900">{stats.normalResults}</div>
              <div>Normal</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-900">{(stats.averageConfidence * 100).toFixed(0)}%</div>
              <div>Avg Confidence</div>
            </div>
          </div>
          {stats.totalAnalyses > 0 && (
            <button
              onClick={handleClearDatabase}
              disabled={isClearing}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors duration-200 disabled:opacity-50"
              title="Clear all stored analysis data"
            >
              <Trash2 className="h-3 w-3" />
              <span>{isClearing ? 'Clearing...' : 'Clear DB'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;