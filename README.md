# TeachBoard

## Candidate CV storage setup

After running `supabase/schema.sql`, confirm the private `candidate-cvs` bucket exists in Supabase Storage.

- Bucket name: `candidate-cvs`
- Visibility: private
- File path format: `{candidateId}/{timestamp}-{filename}`
- Accepted file types in app: PDF, DOC, DOCX
- Max size in app: 5MB

The schema includes storage policies so each candidate can only upload/read/delete objects inside their own folder prefix.
