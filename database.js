import * as sql from "expo-sqlite/legacy"


const db = sql.openDatabase('mydatabase.db');


export const createTable = async () => {
    try {
        if (db) {
            db.transaction(tx => {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS PersonalTask
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT,
                 taskDate TEXT,
                 startTime TEXT,
                 endTime TEXT,
                 budget REAL,
                 detail TEXT,
                 taskColour TEXT)`);

                tx.executeSql(`CREATE TABLE IF NOT EXISTS PersonalBudgetCounter
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 budgetCounter REAL,
                 remainingBudget REAL)`);

                tx.executeSql(`CREATE TABLE IF NOT EXISTS ProjectList
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT)`);

                tx.executeSql(`CREATE TABLE IF NOT EXISTS ProjectTask
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT,
                 taskDate TEXT,
                 startTime TEXT,
                 endTime TEXT,
                 budget REAL,
                 detail TEXT,
                 taskColour TEXT,
                 projectID INTEGER,
                 FOREIGN KEY(projectID) REFERENCES ProjectList(id) ON DELETE CASCADE)`);

                tx.executeSql(`CREATE TABLE IF NOT EXISTS ProjectBudget
                (projectID INTEGER PRIMARY KEY ,
                 projectBudget REAL,
                 remainingBudget REAL,
                 FOREIGN KEY(projectID) REFERENCES ProjectList(id) ON DELETE CASCADE)`);

                tx.executeSql(`CREATE TABLE IF NOT EXISTS Statistics
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                     lastMonthSaved REAL,
                     totalSaved REAL,
                     MWB INT,
                     maxStreak INT,
                     currentStreak INT)`); 

                     tx.executeSql(`CREATE TABLE IF NOT EXISTS MonthlyReset (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        resetDate TEXT
                    );`);
                
                    tx.executeSql(`CREATE TABLE IF NOT EXISTS Notification (
                        id TEXT PRIMARY KEY,
                        taskID INTEGER,
                        FOREIGN KEY(taskID) REFERENCES PersonalTask(id) ON DELETE CASCADE
                    );`);
                
                    tx.executeSql(`CREATE TABLE IF NOT EXISTS ProjectNotification (
                        id TEXT PRIMARY KEY,
                        taskID INTEGER,
                        FOREIGN KEY(taskID) REFERENCES ProjectTask(id) ON DELETE CASCADE
                    );`);
            });

            console.log("Tables created successfully");
        } else {
            console.error("Database not initialized.");
        }
    } catch (error) {
        console.error("Failed to create tables:", error);
    }
};
///////////////// DROP TABLES ///////////////////////////
export const resetDatabase =async () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS PersonalTask;', [], (tx, result) => {
        console.log('Table dropped successfully');
      }, (tx, error) => {
        console.error('Failed to drop table:', error);
      });
   
        tx.executeSql('DROP TABLE IF EXISTS PersonalBudgetCounter;', [], (tx, result) => {
          console.log('Table dropped successfully');
        }, (tx, error) => {
          console.error('Failed to drop table:', error);
        });

        tx.executeSql('DROP TABLE IF EXISTS ProjectList;', [], (tx, result) => {
          console.log('Table dropped successfully');
        }, (tx, error) => {
          console.error('Failed to drop table:', error);
        });
    
        tx.executeSql('DROP TABLE IF EXISTS ProjectTask;', [], (tx, result) => {
          console.log('Table dropped successfully');
        }, (tx, error) => {
          console.error('Failed to drop table:', error);
        });

        tx.executeSql('DROP TABLE IF EXISTS ProjectBudget;', [], (tx, result) => {
          console.log('Table dropped successfully');
        }, (tx, error) => {
          console.error('Failed to drop table:', error);
        });
        tx.executeSql('DROP TABLE IF EXISTS MonthlyReset', [], (tx, result) => {
            console.log('Table dropped successfully');
          }, (tx, error) => {
            console.error('Failed to drop table:', error);
        });
        tx.executeSql('DROP TABLE IF EXISTS Statistics;', [], (tx, result) => {
            console.log('Table dropped successfully');
          }, (tx, error) => {
            console.error('Failed to drop table:', error);
        });
        
        tx.executeSql('DROP TABLE IF EXISTS Notification;', [], (tx, result) => {
            console.log('Table dropped successfully');
          }, (tx, error) => {
            console.error('Failed to drop table:', error);
        });
        
        tx.executeSql('DROP TABLE IF EXISTS ProjectNotification;', [], (tx, result) => {
            console.log('Table dropped successfully');
          }, (tx, error) => {
            console.error('Failed to drop table:', error);
        });
        

    });
    
  
  };


//////////////////////  Personal Task /////////////////////////
export const addPersonalTask = (title,taskDate,startTime,endTime,budget,detail,colour) => { 
    db.transaction(tx => { 
        tx.executeSql(`INSERT INTO 
            PersonalTask (title, taskDate,startTime, endTime,budget,detail,taskColour) 
            VALUES (?,?,?,?,?,?,?);`,
            [title,taskDate,startTime,endTime,budget,detail,colour]
        )
    })
    console.log("Task added successfully");
}


export const completePersonalTask = (id) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM PersonalTask WHERE id=?`,[id]
        );
    });
};

export const deletePersonalTask = async (id) => {
    const deletedTaskBudget= await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT budget FROM PersonalTask WHERE id=?`, [id],
                (_, { rows }) => { 
                    resolve(rows._array[0].budget)
                },
                (_, error) => { 
                    reject(error)
                }
            );
        });
    }
    )
    const remainingBudget = await getPersonalRemainingBudget()
    const replenishedBudget=remainingBudget+deletedTaskBudget

    //end of promise
    db.transaction(tx => { 
        tx.executeSql(`UPDATE PersonalBudgetCounter 
            SET remainingBudget=?
            WHERE id=(SELECT MAX(id) FROM PersonalBudgetCounter)`,[replenishedBudget])
    })

    await completePersonalTask(id)
    const updatedBudget = await getPersonalRemainingBudget();
    console.log("After Delete", updatedBudget);
    return updatedBudget
};

export const getPersonalTask = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM PersonalTask ORDER BY taskDate' , 
          [],
          (_, { rows }) => {
            resolve(rows._array); 
          },
          (_, error) => {
            reject(error); 
          }
        );
      });
    });
  };


// ///////////budget Counter///////
//////////////////////////////////////////////
export const addBudgetCounter = async (budget,budget2) => {
    try {
        // Insert the new budgetCounter
        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `INSERT INTO PersonalBudgetCounter (budgetCounter,remainingBudget) VALUES (?,?);`,
                    [budget,budget2],
                    () => resolve(), 
                    (_, error) => reject(error) 
                );
            });
        });
        console.log("Budget Counter created successfully with value:", budget);

    } catch (error) {
        console.error('Error adding budget counter or updating remaining budget:', error);
    }
};


export const updateBudgetCounter = async (budget) => {
    try {
         //current budget
        const currentBudgetSet = await getSetBudgetCounter() || 0
        
        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE PersonalBudgetCounter
                     SET budgetCounter = ? 
                     WHERE id = (SELECT MAX(id) FROM PersonalBudgetCounter);`,
                    [budget],
                    () => resolve(budget),
                    (_, error) => reject(error)
                );
            });
        });
        
        //remaining budget
        const remainingBudget = await getPersonalRemainingBudget() || 0; 
        console.log('remainingBudget:',remainingBudget)
        
        const budgetSpent = currentBudgetSet - Math.abs(remainingBudget); 
        console.log('budgetSpent:',budgetSpent)

        const newBudget = budget - Math.abs(budgetSpent)
        console.log('budgetNew:',newBudget)

        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE PersonalBudgetCounter
                     SET remainingBudget = ?
                     WHERE id = (SELECT MAX(id) FROM PersonalBudgetCounter);`,
                    [newBudget],
                    () => resolve(newBudget),
                    (_, error) => reject(error)
                );
            });
        });
        console.log('Updated budgetCounter and remainingBudget:', budget, newBudget);


    } catch (error) {
        console.error('Error updating budget or calculating remaining budget:', error);
    }
};

export const getPersonalRemainingBudget = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT remainingBudget FROM PersonalBudgetCounter WHERE id = (SELECT MAX(id) FROM PersonalBudgetCounter);`,
                [],
                (_, { rows }) => {
                    resolve(rows._array[0] ? rows._array[0].remainingBudget: null);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const getTotalPersonalSpent = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT SUM(budget) AS totalBudget FROM PersonalTask;',
                [],
                (_, { rows }) => {
                    
                    resolve(rows.item(0).totalBudget || 0); 
                },
                (tx, error) => {
                  
                    reject(error);
                }
            );
        });
    });
};

 export const getSetBudgetCounter = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT budgetCounter FROM PersonalBudgetCounter WHERE id = (SELECT MAX(id) FROM PersonalBudgetCounter);`,
                [],
                (_, { rows }) => {
                    resolve(rows._array[0] ? rows._array[0].budgetCounter: null);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const subtractFromBudgetCounter = async () => {
    try {
        const currentBudget = await getPersonalRemainingBudget()

        const recentTaskBudget= await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT budget FROM PersonalTask WHERE id=(SELECT MAX(id) FROM PersonalTask);`,
                    [],
                    (_, { rows }) => {
                        resolve(rows._array[0] ? rows._array[0].budget : null);
                    },
                    (tx, error) => {
                        reject(error);
                    }
            
                )
            });
        });
        const newBudgetCounter = currentBudget - recentTaskBudget

        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE PersonalBudgetCounter
                     SET remainingBudget = ?
                     WHERE id = (SELECT MAX(id) FROM PersonalBudgetCounter);`,
                    [newBudgetCounter],
                    () => resolve(newBudgetCounter),
                    (_, error) => reject(error)
                );
            });
        });
        return newBudgetCounter
    } catch (error) {
        console.error('Error subtracting from budget counter:', error);
        return null; 
    }
};

export const resetPersonalBudget = async () => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM PersonalBudgetCounter WHERE id=(SELECT MAX(id) FROM PersonalBudgetCounter);', [], (tx, result) => {
          console.log('Row deleted successfully');
        }, (tx, error) => {
          console.error('Row Failed to delete:', error);
        });
    });
  
};

export const onMonthlyResetBudget=async ()=> {
    await resetPersonalBudget()
    const remainingTaskBudget = await getTotalPersonalSpent()
    await addBudgetCounter(null,-remainingTaskBudget)

 
}





//////////////// project list page //////////////////////////////
export const addProject = (projectName) => { 
    db.transaction(tx => { 
        tx.executeSql(`INSERT INTO 
            ProjectList (title) 
            VALUES (?);`,
            [projectName]

        )
    })
    console.log('Project added'+getProjectList())
}

export const getProjectList = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM ProjectList;`,
                [],
                (_, { rows }) => {
                    resolve(rows._array||[]); 
                },
                (_, error) => reject(error)
            );
        });
    });
};

export const deleteListProject = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM ProjectList WHERE id = ?;`, 
                [id],
                (_, result) => resolve(true),
                (_, error) => reject(error)
            );
        });
    });
};



///////////////////// project task  ////////////////////

export const addProjectTask = (title, taskDate, startTime, endTime, budget, detail,colour, projectID) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ProjectTask (title, taskDate, startTime, endTime, budget, detail,taskColour, projectID) 
                 VALUES (?, ?, ?, ?, ?, ?, ?,?);`,
                [title, taskDate, startTime, endTime, budget, detail,colour, projectID],
                (_, result) => {
                    console.log('projectTask Added ProjectID: ', projectID);
                    resolve(result);
                },
                (tx, error) => {
                    console.log('Error adding projectTask: ', error);
                    reject(error);
                }
            );
        });
    });
};



export const getProjectTask = async (projectID) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ProjectTask WHERE ProjectID=? ORDER BY taskDate,startTime;`, 
          [projectID],
            (_, { rows }) => {
              console.log('(getProjectTask)Fetched Project Task: ',rows._array+ 'projectId:', projectID)
            resolve(rows._array); 
          },
          (_, error) => {
            reject(error); 
          }
        );
      });
    });
  };


export const subtractFromProjectBudgetCounter = async (projectID) => {
    try {
      
        const currentBudget = await getProjectBudget(projectID)

        const recentTaskBudget= await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT budget FROM ProjectTask WHERE id=(SELECT MAX(id) FROM ProjectTask);`,
                    [],
                    (_, { rows }) => {
                        resolve(rows._array[0] ? rows._array[0].budget :0);
                    },
                    (tx, error) => {
                        reject(error);
                    }
            
                )
            });
        });
        console.log('recentProjectBudget.db:' + recentTaskBudget)
        console.log('currentProjectBudget.db'+currentBudget)
        const newBudgetCounter = currentBudget - recentTaskBudget
        console.log('newProjectBudget.db' + newBudgetCounter)
        
        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE ProjectBudget
                     SET remainingBudget = ?
                     WHERE ProjectID = ?;`,
                    [newBudgetCounter,projectID],
                    () => resolve(newBudgetCounter),
                    (_, error) => reject(error)
                );
            });
        });

        return newBudgetCounter

    } catch (error) {
        console.error('Error subtracting from budget counter:', error);
        return null; 
    }
};


export const completeProjectTask = (id) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM ProjectTask WHERE id=?`,[id]
        );
    });
};


export const deleteProjectTask = async (id,projectID) => {
    const deletedTaskBudget= await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT budget FROM ProjectTask WHERE id=?`, [id],
                (_, { rows }) => { 
                    resolve(rows._array[0].budget)
                },
                (_, error) => { 
                    reject(error)
                }
            );
        });
    }
    )
    const remainingBudget = await getProjectBudget(projectID)
    const replenishedBudget=remainingBudget+deletedTaskBudget

   
    db.transaction(tx => { 
        tx.executeSql(`UPDATE ProjectBudget 
            SET remainingBudget=?
            WHERE ProjectID=?`,[replenishedBudget,projectID])
    })

    await completeProjectTask(id)
    const updatedBudget = await getProjectBudget(projectID);
    console.log("After Delete", updatedBudget);
    return updatedBudget
};

////////////////////// Project Page Budget //////////////////////////////////
export const getProjectBudget = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT remainingBudget FROM ProjectBudget WHERE projectID = ?;`,
                [id],
                (_, { rows }) => {
                    console.log('Query executed with id:', id);
                    console.log('Query Results:', rows._array);
                    
                    if (rows._array.length === 0) {
                        console.log('No records found for projectID:', id);
                        resolve(null); 
                    } else {
                        console.log('Record found:', rows._array[0]);
                        resolve(rows._array[0].remainingBudget);
                    }
                },
                (tx, error) => {
                    console.error('Error fetching project budget:', error.message);
                    reject(error);
                }
            );
        });
    });
};


export const addProjectBudgetCounter = async (id,budget) => {
    try {
        // Insert the new budgetCounter
        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `INSERT INTO ProjectBudget (projectID,projectBudget,remainingBudget) VALUES (?,?,?);`,
                    [id,budget,budget],
                    () => resolve(), 
                    (_, error) => reject(error) 
                );
            });
        });
        console.log("Project Budget Counter created successfully with value:", budget);

    } catch (error) {
        console.error('Error adding Project budget counter or updating remaining budget:', error);
    }
};

export const getProjectTotalSpent = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                 'SELECT SUM(budget) AS totalBudget FROM ProjectTask WHERE projectId=?;',
                [id],
                (_, { rows }) => {
                    
                    const result = rows._array[0]
                    resolve(result.totalBudget);
                },
                (tx, error) => {
                   
                    reject(error);
                }
            );
        });
    });
};

export const getProjectBudgetSet= (projectID) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT projectBudget FROM ProjectBudget WHERE ProjectID =?;`,
                [projectID],
                (_, { rows }) => {
                    resolve(rows._array[0] ? rows._array[0].projectBudget: null);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};



export const updateProjectBudgetCounter = async (projectID,budget) => {
    try {
         //current budget
        const currentBudgetSet = await getProjectBudgetSet(projectID) ||null
        
        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE ProjectBudget
                     SET projectBudget = ? 
                     WHERE projectId = ?;`,
                    [budget,projectID],
                    () => resolve(budget),
                    (_, error) => reject(error)
                );
            });
        });

        //remaining budget
        const totalTaskBudget = await getProjectBudget(projectID) || 0;
        console.log("totalTaskBudget fetched",totalTaskBudget)
        console.log("currentBudgetSet fetched",currentBudgetSet)
        const budgetSpent = currentBudgetSet - totalTaskBudget;

        const newBudget = budget - budgetSpent
        console.log("newBudget:",newBudget)

        await new Promise((resolve, reject) => {
            db.transaction(tx => { 
                tx.executeSql(
                    `UPDATE ProjectBudget
                     SET remainingBudget = ?
                     WHERE projectId = ?;`,
                    [newBudget,projectID],
                    () => resolve(newBudget),
                    (_, error) => reject(error)
                );
            });
        });
        console.log('Updated budgetCounter and remainingBudget:', budget, newBudget);
    } catch (error) {
        console.error('Error updating budget or calculating remaining budget:', error);
    }
};


export const resetProjectBudget = async (projectID) => {
 db.transaction(tx => {
        tx.executeSql('DELETE FROM ProjectBudget WHERE ProjectID=?;', [projectID], (tx, result) => {
            console.log('Row deleted successfully');
        }, (tx, error) => {
            console.error('Row Failed to delete:', error);
        });
 });          
};

//////////// For notification /////////////
export const insertIntoNotification = async (notificationID,taskID) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => { 
            tx.executeSql(
                `INSERT INTO Notification (id,taskID) VALUES (?,?);`,
                [notificationID,taskID],
                (_,result) => resolve(result), 
                (_, error) => reject(error) 
            );
        });
    });
}


export const getTaskNotificationID = async (taskID) => { 
    return new Promise((resolve, reject) => {
      db.transaction(tx => { 
        tx.executeSql(
          `SELECT id FROM Notification WHERE taskID=?;`,
          [taskID],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0).id || null);
            } else {
              console.log('No notification found for taskID:', taskID);
              resolve(null);
            }
          },
          (_, error) => reject(error) 
        );
      });
    });
  };
  

export const insertIntoProjectNotification = async (notificationID,taskID) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => { 
            tx.executeSql(
                `INSERT INTO ProjectNotification (id,taskID) VALUES (?,?);`,
                [notificationID,taskID],
                (_,result) => resolve(result), 
                (_, error) => reject(error) 
            );
        });
    });
}


export const getProjectTaskNotificationID = async (taskID) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => { 
            tx.executeSql(
                `SELECT id FROM ProjectNotification WHERE taskID=?;`,
                [taskID],
                (_, result) => { 
                    if (result.rows.length > 0) {
                        resolve(result.rows.item(0).id || null);
                      } else {
                        console.log('No notification found for taskID:', taskID);
                        resolve(null);
                      }
                }, 
                (_, error) => reject(error) 
            );
        });
    });
}


// FOR STATISTICS PAGE ////////////////////////////
export const getStatistics = () => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM Statistics;`, 
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        resolve(rows._array); 
                    } else { 
                        resolve(null); 
                    }
                },
                (tx, error) => {
                    reject(error); 
                }
            );
        });
    });
};


export const updateStatistics = (lms,ts,mwb,ms,cs) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE Statistics
                SET lastMonthSaved=?,totalSaved=?,MWB=?,maxStreak=?,currentStreak=?
                WHERE id=1 ;`, 
                [lms,ts,mwb,ms,cs],
                (_, { rows }) => {
                    resolve(rows._array); 
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
}




export const insertIntoStatistics = async (lms,ts,mwb,ms,cs) => { 
    await new Promise((resolve, reject) => {
        db.transaction(tx => { 
            tx.executeSql(
                `INSERT INTO Statistics (lastMonthSaved, totalSaved,MWB,maxStreak,currentStreak) VALUES (?,?,?,?,?);`,
                [lms,ts,mwb,ms,cs],
                (_,result) => resolve(result), 
                (_, error) => reject(error) 
            );
        });
    });
}

export const getMonthlyReset = async () => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT resetDate FROM MonthlyReset WHERE id = 1;`, 
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const resetDateString = rows._array[0].resetDate;
                        const resetDate = new Date(resetDateString);
                        console.log("Retrieved reset date string:", resetDateString);
                        console.log("Converted reset date object:", resetDate);
                        resolve(resetDate);
                    } else {
                        resolve(null); // No reset date found
                    }
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};


export const updateMonthlyReset = async (newResetDate) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE MonthlyReset
                SET resetDate=? WHERE id=1 ;`, 
                [newResetDate.toISOString()],
                (_, result) => {
                    resolve(result); 
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
        console.log("updated reset date")  
    });
}

export const insertMonthlyReset = async (newResetDate) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO MonthlyReset(resetDate) VALUES(?);`, 
                [newResetDate.toISOString()], 
                (_, { rows }) => {
                    console.log("Inserting reset date:", newResetDate.toISOString());
                    resolve(rows._array); 
                },
                (tx, error) => {
                    console.error("Failed to insert reset date:", error);
                    reject(error);
                }
            );
        });
    });
};



