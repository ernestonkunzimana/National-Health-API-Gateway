-- Seed initial data for Rwanda HealthLink system

-- Insert government agencies
INSERT INTO organizations (id, name, type, license_number, address, phone, email, contact_person, integration_status) VALUES
(uuid_generate_v4(), 'Ministry of Health Rwanda', 'government_agency', 'GOV-MOH-001', 'Kigali, Rwanda', '+250788123456', 'info@moh.gov.rw', 'Dr. Jean Baptiste Nzeyimana', 'connected'),
(uuid_generate_v4(), 'Rwanda Social Security Board', 'government_agency', 'GOV-RSSB-001', 'Kigali, Rwanda', '+250788123457', 'info@rssb.rw', 'Emmanuel Nkurunziza', 'connected'),
(uuid_generate_v4(), 'National Health Insurance Consortium', 'government_agency', 'GOV-NHIC-001', 'Kigali, Rwanda', '+250788123458', 'info@nhic.gov.rw', 'Dr. Marie Claire Uwimana', 'connected');

-- Insert major hospitals
INSERT INTO organizations (id, name, type, license_number, address, phone, email, contact_person, integration_status) VALUES
(uuid_generate_v4(), 'Centre Hospitalier Universitaire de Kigali', 'hospital', 'HOSP-CHUK-001', 'Kigali, Rwanda', '+250788234567', 'info@chuk.rw', 'Dr. Vincent Mutabazi', 'connected'),
(uuid_generate_v4(), 'King Faisal Hospital', 'hospital', 'HOSP-KFH-001', 'Kigali, Rwanda', '+250788234568', 'info@kfh.rw', 'Dr. Emile Rwamasirabo', 'connected'),
(uuid_generate_v4(), 'Rwanda Defence Force Military Hospital', 'hospital', 'HOSP-RDF-001', 'Kigali, Rwanda', '+250788234569', 'info@rdfhospital.rw', 'Dr. Colonel Jean Bosco Ndahimana', 'connected'),
(uuid_generate_v4(), 'Butaro District Hospital', 'hospital', 'HOSP-BUT-001', 'Butaro, Northern Province', '+250788234570', 'info@butaro.rw', 'Dr. Agnes Binagwaho', 'pending');

-- Insert insurance companies
INSERT INTO organizations (id, name, type, license_number, address, phone, email, contact_person, integration_status) VALUES
(uuid_generate_v4(), 'SONARWA General Insurance', 'insurance_company', 'INS-SON-001', 'Kigali, Rwanda', '+250788345678', 'health@sonarwa.rw', 'Jean Claude Habimana', 'connected'),
(uuid_generate_v4(), 'RADIANT Insurance', 'insurance_company', 'INS-RAD-001', 'Kigali, Rwanda', '+250788345679', 'claims@radiant.rw', 'Alice Mukamana', 'pending'),
(uuid_generate_v4(), 'Community Based Health Insurance', 'insurance_company', 'INS-CBHI-001', 'Nationwide', '+250788345680', 'info@cbhi.rw', 'Dr. Fidele Ngabo', 'connected');

-- Insert system admin user
INSERT INTO users (id, email, first_name, last_name, role, is_active, email_verified) VALUES
(uuid_generate_v4(), 'admin@healthlink.rw', 'System', 'Administrator', 'admin', true, true);

-- Insert sample hospital staff users
INSERT INTO users (id, email, first_name, last_name, phone, role, organization_id, is_active, email_verified) 
SELECT 
    uuid_generate_v4(), 
    'staff@chuk.rw', 
    'Dr. Alice', 
    'Uwimana', 
    '+250788456789', 
    'hospital_staff', 
    o.id, 
    true, 
    true
FROM organizations o WHERE o.name = 'Centre Hospitalier Universitaire de Kigali';

-- Insert sample patients
INSERT INTO patients (id, national_id, first_name, last_name, date_of_birth, gender, phone, address, insurance_number, insurance_provider_id) 
SELECT 
    uuid_generate_v4(),
    '1198780123456789',
    'Jean Baptiste',
    'Niyonsenga',
    '1987-03-15',
    'male',
    '+250788567890',
    'Gasabo District, Kigali',
    'CBHI-2024-001234',
    o.id
FROM organizations o WHERE o.name = 'Community Based Health Insurance';

INSERT INTO patients (id, national_id, first_name, last_name, date_of_birth, gender, phone, address, insurance_number, insurance_provider_id) 
SELECT 
    uuid_generate_v4(),
    '1199012345678901',
    'Marie Claire',
    'Mukamana',
    '1990-07-22',
    'female',
    '+250788567891',
    'Nyarugenge District, Kigali',
    'RSSB-2024-005678',
    o.id
FROM organizations o WHERE o.name = 'Rwanda Social Security Board';

-- Create sample claims
INSERT INTO claims (id, claim_number, patient_id, provider_id, insurance_provider_id, claim_type, diagnosis_code, diagnosis_description, treatment_date, total_amount, status)
SELECT 
    uuid_generate_v4(),
    'CLM-2024-001',
    p.id,
    h.id,
    p.insurance_provider_id,
    'outpatient',
    'Z00.00',
    'General health examination',
    CURRENT_DATE - INTERVAL '5 days',
    25000.00,
    'approved'
FROM patients p, organizations h 
WHERE p.first_name = 'Jean Baptiste' 
AND h.name = 'Centre Hospitalier Universitaire de Kigali'
LIMIT 1;
