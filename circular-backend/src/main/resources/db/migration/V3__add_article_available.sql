-- Flyway migration to add AVAILABLE column to ARTICLE table (Oracle/H2 compatible)

-- For Oracle:
ALTER TABLE ARTICLE ADD (AVAILABLE NUMBER(1) DEFAULT 1);

-- For H2 (will ignore if using Oracle):
-- ALTER TABLE ARTICLE ADD AVAILABLE BOOLEAN DEFAULT TRUE;

