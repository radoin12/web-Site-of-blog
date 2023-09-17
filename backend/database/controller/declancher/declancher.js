const db = require("../../db");

const createTriggerForNewUser = (newId) => {
    const query = `

        INSERT INTO notification_counts (userId, post_count) VALUES (?,0);
       
    `;
  
    db.query(query, [newId],(err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(' créé avec succès !');
      }
    });
  };

  const declancheurStatus=()=>{

   const querry=`

   CREATE TRIGGER after_user_insert_to_status
  AFTER INSERT ON users FOR EACH ROW
  BEGIN
    -- Insérer une ligne dans la table notification_status pour le nouvel utilisateur
    INSERT INTO notification_status (user_id, notification_id)
    SELECT NEW.id AS user_id, n.id AS notification_id
    FROM notification n;
  END;

  
   `
   db.query(querry,(err,resonse)=>{
    if (err) {
        console.log(err)
    }
    else{
        console.log('triggeler a ete creé correctement ')
    }
   })
  
  
  }
  
  
  module.exports=createTriggerForNewUser