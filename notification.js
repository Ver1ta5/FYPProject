import * as Notifications from 'expo-notifications';
import { insertIntoNotification,insertIntoProjectNotification } from './database';

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was denied');
    return;
  }
  console.log('Permission granted:', status);
};


const convertTo24Hour = (time12hr) => {
    if (!time12hr) {
        return '00:00:00'; 
    }

    // split the AM Time and PM time
    const [time, modifier] = time12hr.split(' ');
    let [hours, minutes, seconds] = time.split(':');
    
   
    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
};

const combineDateTime = (date, time='00:00:00') => {
    const timeIn24Hr=convertTo24Hour(time)
    console.log(new Date(`${date}T${timeIn24Hr}`))
    return new Date(`${date}T${timeIn24Hr}`);
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  
 export const deleteNotification = async (notificationID) => {
    await Notifications.cancelScheduledNotificationAsync(notificationID);
  };

  export const scheduleNotification = async (title, date,time,taskId, detail = '') => {
      const dateTime = combineDateTime(date, time)
      const currentTime = new Date();
      if (dateTime <= currentTime) {
          const notificationId =await Notifications.scheduleNotificationAsync({
              content: {
                  title: `Task To do: ${title}`,
                  body: `Task Detail: ${detail}`,
                  sound: true,
              },
              trigger: {
                  seconds: 1, 
              },
          });
          insertIntoNotification(notificationId,taskId)
      } else {
        const notificationId=await Notifications.scheduleNotificationAsync({
              content: {
                  title: `Task To Do: ${title}`,
                  body: `Task Detail: ${detail}`,
                  sound: true,
              },
              trigger: {
                  date: dateTime,
              },
        })
        insertIntoNotification(notificationId,taskId)
      }
};


  export const scheduleProjectNotification = async (title, date,time,taskId, detail = '') => {
      const dateTime = combineDateTime(date, time)
      const currentTime = new Date();
      if (dateTime <= currentTime) {
          console.log('Scheduling immediate notification');
          const notificationId =await Notifications.scheduleNotificationAsync({
              content: {
                  title: `Task To do: ${title}`,
                  body: `Task Detail: ${detail}`,
                  sound: true,
              },
              trigger: {
                  seconds: 1, 
              },
          });
          insertIntoProjectNotification(notificationId,taskId)
      } else {
        const notificationId=await Notifications.scheduleNotificationAsync({
              content: {
                  title: `Task To Do: ${title}`,
                  body: `Task Detail: ${detail}`,
                  sound: true,
              },
              trigger: {
                  date: dateTime, 
              },
        })
        insertIntoProjectNotification(notificationId,taskId)
      }
        console.log('Notifications has been scheduled.');
};


    
