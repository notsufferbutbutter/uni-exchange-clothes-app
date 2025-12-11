-- Flyway migration V4: rename potentially problematic column names TYPE, SIZE, CONDITION to ITEM_TYPE, ITEM_SIZE, ITEM_CONDITION
-- This migration is written for Oracle. It will attempt to add new columns and copy data if old columns exist.

DECLARE
    cnt NUMBER := 0;
BEGIN
    BEGIN
        EXECUTE IMMEDIATE 'ALTER TABLE ARTICLE ADD (ITEM_TYPE VARCHAR2(255))';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE != -1430 THEN -- ORA-01430: column being added already exists
                NULL; -- ignore if already exists
            END IF;
    END;

    BEGIN
        EXECUTE IMMEDIATE 'ALTER TABLE ARTICLE ADD (ITEM_SIZE VARCHAR2(255))';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE != -1430 THEN
                NULL;
            END IF;
    END;

    BEGIN
        EXECUTE IMMEDIATE 'ALTER TABLE ARTICLE ADD (ITEM_CONDITION VARCHAR2(255))';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE != -1430 THEN
                NULL;
            END IF;
    END;

    -- Copy data if legacy columns exist (check USER_TAB_COLUMNS)
    SELECT COUNT(*) INTO cnt FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'ARTICLE' AND COLUMN_NAME = 'TYPE';
    IF cnt > 0 THEN
        EXECUTE IMMEDIATE 'UPDATE ARTICLE SET ITEM_TYPE = TYPE WHERE ITEM_TYPE IS NULL';
    END IF;

    SELECT COUNT(*) INTO cnt FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'ARTICLE' AND COLUMN_NAME = 'SIZE';
    IF cnt > 0 THEN
        EXECUTE IMMEDIATE 'UPDATE ARTICLE SET ITEM_SIZE = SIZE WHERE ITEM_SIZE IS NULL';
    END IF;

    SELECT COUNT(*) INTO cnt FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'ARTICLE' AND COLUMN_NAME = 'CONDITION';
    IF cnt > 0 THEN
        EXECUTE IMMEDIATE 'UPDATE ARTICLE SET ITEM_CONDITION = CONDITION WHERE ITEM_CONDITION IS NULL';
    END IF;

    COMMIT;
END;
/
-- Optionally, you may drop the old columns after verification. This script leaves them intact.
