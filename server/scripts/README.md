# Server Scripts (One-Time Use)

Dcp ce directory, contient genre les scripts de migration , verification d utilitaires, **qui sont pas utilise pas ce website en cours d utilisation**,  . ils etait genre utilise pendant le devloppment pour: 

- **Verification de structure excel:** `check_excel_structure.js`, `check_all_columns.js`, `check_cols.js`, `check_images.js`, etc.
- **migration de donne:** `add_benefices_columns.js`, `addCurrencyColumn.js`, `addHeaders.js`, `populate_benefices.js`
- **reparers les imgaes la qui voulait pas se faire load et tout:** `fix_image_names.js`, `fix_image_names_v2.js`
- **inoection user/produits** `check_users.js`, `checkUserProfile.js`, `inspect_products.js`, `listUsers.js`, `readUserData.js`
- **Tests et debugging:** `test_api.js`, `test_server.js`, `debug_db.js`, etc.

**Usage:** execute depuis `server/` directory , e.g.:
```
node scripts/check_excel_structure.js
```

la plpaurt des scripts sont dans `server/data/BDD1.xlsx`. 
