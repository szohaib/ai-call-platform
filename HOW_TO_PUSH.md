# How to Push Code to GitHub

Your code is ready but stuck locally. Here's how to push it:

## Current Situation

- ✅ Branch: `feature/auth-and-credits`
- ✅ Commits: 4 commits ready to push
- ❌ Not yet on GitHub (SSH key issue)

## Solution: Use Personal Access Token

### Step 1: Create GitHub Token (2 minutes)

1. Go to: https://github.com/settings/tokens/new
2. Note: "AI Call Platform - Code Push"
3. Expiration: 30 days (or your choice)
4. Select scopes:
   - ✅ **repo** (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (starts with `ghp_`)

### Step 2: Configure Git with Token (1 minute)

```bash
cd ~/Code/ai-call-platform

# Replace YOUR_TOKEN with the token you just copied
git remote set-url origin https://YOUR_TOKEN@github.com/szohaib/ai-call-platform.git
```

Example:
```bash
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/szohaib/ai-call-platform.git
```

### Step 3: Push the Code (30 seconds)

```bash
git push -u origin feature/auth-and-credits
```

You should see:
```
Enumerating objects: ...
Counting objects: 100% ...
Writing objects: 100% ...
To https://github.com/szohaib/ai-call-platform.git
 * [new branch]      feature/auth-and-credits -> feature/auth-and-credits
```

✅ **Done!**

## Step 4: Create Pull Request

1. Go to: https://github.com/szohaib/ai-call-platform
2. You'll see a yellow banner: "Compare & pull request"
3. Click it
4. Title: **Add Authentication and Credit System**
5. Description: Copy from `DEPLOYMENT_INSTRUCTIONS.md` (lines 29-209)
6. Click "Create pull request"

✅ **PR Created!**

## Alternative: Add SSH Key to GitHub

If you prefer SSH:

### 1. Get your public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output (starts with `ssh-ed25519`)

### 2. Add to GitHub:
- Go to: https://github.com/settings/keys
- Click "New SSH key"
- Title: "Wakemate VM"
- Key: Paste the key
- Click "Add SSH key"

### 3. Push:
```bash
cd ~/Code/ai-call-platform
git remote set-url origin git@github.com:szohaib/ai-call-platform.git
git push -u origin feature/auth-and-credits
```

## Verify Success

After pushing, visit:
https://github.com/szohaib/ai-call-platform/tree/feature/auth-and-credits

You should see:
- 4 new commits
- 15 files changed
- All your new files

## What's Next?

After the PR is created:

1. **Review the changes** (see what was built)
2. **Follow SETUP.md** (configure Firebase and Stripe)
3. **Test locally** (make sure everything works)
4. **Merge the PR** (only after testing)
5. **Deploy!** 🚀

## Need Help?

If push fails:
1. Check token has `repo` scope
2. Token not expired
3. Token copied correctly (no spaces)
4. Repository name is correct: `szohaib/ai-call-platform`

## Files Ready to Push

```
backend/config/firebase.js
backend/middleware/auth.js
backend/routes/auth.js
backend/routes/payments.js
backend/services/creditService.js
backend/server.js (modified)
backend/routes/calls.js (modified)
frontend/index.html (modified)
.env.example
.gitignore (modified)
SETUP.md
README.md (rewritten)
DEPLOYMENT_INSTRUCTIONS.md
TASK_COMPLETION_SUMMARY.md
START_HERE.md
HOW_TO_PUSH.md (this file)
```

Total: 16 files (11 new, 5 modified)

---

**Quick Command Summary:**

```bash
# 1. Set remote with token
cd ~/Code/ai-call-platform
git remote set-url origin https://YOUR_TOKEN@github.com/szohaib/ai-call-platform.git

# 2. Push
git push -u origin feature/auth-and-credits

# 3. Go to GitHub and create PR
# https://github.com/szohaib/ai-call-platform
```

**That's it!** 🚀
